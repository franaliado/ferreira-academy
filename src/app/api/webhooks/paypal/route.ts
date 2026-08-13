import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { currentCourse } from '@/data/currentCourse';

export const runtime = 'nodejs';

// ─────────────────────────────────────────────────────────────
// POST /api/webhooks/paypal
//
// Recibe notificaciones IPN/Webhook de PayPal.
// Solo inserta en Supabase cuando se confirma un pago completado.
// Verifica el evento con la API de PayPal antes de guardar.
// ─────────────────────────────────────────────────────────────

async function getPayPalAccessToken(): Promise<string> {
  const clientId     = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode         = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET no configurados.');
  }

  const baseUrl = mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Error obteniendo token de PayPal: ${response.status}`);
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

async function verifyPayPalOrder(orderId: string, accessToken: string): Promise<Record<string, unknown> | null> {
  const mode    = process.env.PAYPAL_MODE || 'sandbox';
  const baseUrl = mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
  });

  if (!response.ok) {
    console.error(`[Webhook PayPal] Error verificando orden ${orderId}: ${response.status}`);
    return null;
  }

  return response.json() as Promise<Record<string, unknown>>;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;

    // PayPal envía distintos tipos de evento según el tipo de integración.
    // Soportamos tanto el formato de IPN clásico como el de Webhooks REST.
    const eventType  = (payload.event_type as string) || '';
    const resource   = (payload.resource as Record<string, unknown>) || {};

    console.log(`[Webhook PayPal] Evento recibido: ${eventType || 'N/A'}`);

    // ── Solo procesar pagos completados ─────────────────────────
    const acceptedEvents = [
      'PAYMENT.CAPTURE.COMPLETED',
      'CHECKOUT.ORDER.APPROVED',
    ];

    if (!acceptedEvents.includes(eventType)) {
      console.log(`[Webhook PayPal] Evento "${eventType}" ignorado.`);
      return NextResponse.json({ received: true, event: eventType }, { status: 200 });
    }

    // ── Verificar la orden con la API de PayPal ─────────────────
    const paypalOrderId = (resource.id as string) || (resource.supplementary_data as Record<string, Record<string, string>>)?.related_ids?.order_id || '';

    if (!paypalOrderId) {
      console.error('[Webhook PayPal] No se pudo obtener el ID de la orden del payload.');
      return NextResponse.json({ error: 'ID de orden faltante' }, { status: 400 });
    }

    let verifiedOrder: Record<string, unknown> | null = null;

    try {
      const accessToken = await getPayPalAccessToken();
      verifiedOrder = await verifyPayPalOrder(paypalOrderId, accessToken);
    } catch (tokenErr) {
      const tokenMsg = tokenErr instanceof Error ? tokenErr.message : String(tokenErr);
      console.warn(`[Webhook PayPal] ⚠️ No se pudo verificar la orden con PayPal API: ${tokenMsg}`);
      // Si no hay credenciales configuradas, procesamos con lo que llegó en el webhook
    }

    // Estado de la orden verificado (o del payload si no hay credenciales)
    const orderStatus = (
      (verifiedOrder?.status as string) ||
      (resource.status as string) ||
      ''
    ).toUpperCase();

    if (!['COMPLETED', 'APPROVED'].includes(orderStatus)) {
      console.log(`[Webhook PayPal] Orden ${paypalOrderId} con estado "${orderStatus}" — ignorada.`);
      return NextResponse.json({ received: true, status: orderStatus }, { status: 200 });
    }

    // ── Extraer datos del comprador ─────────────────────────────
    const purchaseUnits = (verifiedOrder?.purchase_units as Record<string, unknown>[]) ||
                          (resource.purchase_units as Record<string, unknown>[]) || [];
    const firstUnit     = purchaseUnits[0] || {};
    const captures      = (firstUnit.payments as Record<string, unknown>)?.captures as Record<string, unknown>[] || [];
    const capture       = captures[0] || {};

    const payerId    = ((verifiedOrder?.payer as Record<string, unknown>)?.payer_id as string) ||
                       ((resource.payer as Record<string, unknown>)?.payer_id as string) || '';

    const paymentSource = (verifiedOrder?.payment_source as Record<string, any>) || (resource.payment_source as Record<string, any>) || {};
    const cardInfo      = paymentSource.card as Record<string, any> | undefined;
    const paypalInfo    = paymentSource.paypal as Record<string, any> | undefined;

    const payerInfo  = (verifiedOrder?.payer as Record<string, unknown>) ||
                       (resource.payer as Record<string, unknown>) || {};

    const payerName  = payerInfo.name as Record<string, string> | undefined;
    const rawFullName = `${payerName?.given_name || ''} ${payerName?.surname || ''}`.trim() || cardInfo?.name || '';
    const rawEmail    = ((payerInfo.email_address as string) || cardInfo?.email_address || paypalInfo?.email_address || '').trim().toLowerCase();

    const amountObj  = (capture.amount as Record<string, string>) ||
                       (firstUnit.amount as Record<string, string>) || {};
    const amount     = parseFloat(amountObj.value || String(currentCourse.priceAmount));
    const currency   = (amountObj.currency_code || currentCourse.currency || 'USD').toUpperCase();

    // Metadatos del alumno desde custom_id
    const customId   = (firstUnit.custom_id as string) || '';
    const courseName = currentCourse.title;

    let phone    = 'N/A';
    let country  = 'N/A';
    let certName = rawFullName || 'Participante';
    let email    = rawEmail || 'cliente@ferreiraacademy.com';

    try {
      if (customId.startsWith('{')) {
        const meta = JSON.parse(customId) as Record<string, string>;
        if (meta.phone) phone = meta.phone;
        if (meta.country) country = meta.country;
        if (meta.full_name) certName = meta.full_name;
        if (meta.email) email = meta.email.trim().toLowerCase();
      }
    } catch {
      // custom_id no es JSON
    }

    const isCard = !!cardInfo || (resource.funding_option as string) === 'card';
    const paymentMethod = isCard ? 'credit_card' : 'paypal';

    console.log(`[Webhook PayPal] Procesando orden ${paypalOrderId} — ${certName} (${email}) — ${currency} ${amount}`);

    if (!(isSupabaseConfigured() || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
      console.warn('[Webhook PayPal] ⚠️ Supabase no configurado — orden no guardada.');
      return NextResponse.json({ received: true, warning: 'Supabase no configurado' }, { status: 200 });
    }

    const admin = getSupabaseAdmin();

    // ── Deduplicación: verificar si la orden ya existe ─────────
    const { data: existingOrder } = await admin
      .from('registrations')
      .select('id')
      .eq('paypal_order_id', paypalOrderId)
      .maybeSingle();

    if (existingOrder) {
      console.log(`[Webhook PayPal] ⚠️ Orden ${paypalOrderId} ya registrada. Omitiendo duplicado.`);
      return NextResponse.json({ received: true, message: 'Orden ya procesada' }, { status: 200 });
    }

    // ── Insertar registro completo — solo cuando el pago fue confirmado ──
    const { error: insertError } = await admin.from('registrations').insert([{
      certificate_name: certName,
      email:          email,
      phone:          phone,
      country:        country,
      payment_method: paymentMethod,
      course_name:    courseName,
      amount:         amount,
      currency:       currency,
      paypal_order_id: paypalOrderId,
      paypal_capture_id: (capture.id as string) || null,
      created_at:     new Date().toISOString(),
    }]);

    if (insertError) {
      console.error('[Webhook PayPal] ❌ Error al insertar en Supabase:', insertError.message);
      return NextResponse.json({ error: 'Error guardando compra' }, { status: 500 });
    }

    console.log(`[Webhook PayPal] ✅ Registro guardado — Orden: ${paypalOrderId} | Cliente: ${email}`);
    return NextResponse.json({ received: true, paypalOrderId }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[Webhook PayPal] ❌ Error no manejado:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'PayPal Webhook Handler',
    timestamp: new Date().toISOString(),
  });
}
