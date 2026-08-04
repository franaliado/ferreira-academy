import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest, 'utf8'), Buffer.from(signature, 'utf8'));
  } catch (err) {
    console.error('[Webhook LS] Error al verificar firma:', err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('[Webhook LS] LEMON_SQUEEZY_WEBHOOK_SECRET no está configurado');
      return NextResponse.json({ error: 'Webhook secret no configurado' }, { status: 500 });
    }

    const signature = request.headers.get('x-signature');
    if (!signature) {
      console.error('[Webhook LS] Firma X-Signature faltante — petición rechazada');
      return NextResponse.json({ error: 'Firma faltante' }, { status: 401 });
    }

    // ── Verificar firma HMAC-SHA256 ────────────────────────────
    const isValid = verifySignature(rawBody, signature, secret);
    if (!isValid) {
      console.error('[Webhook LS] Firma inválida — petición rechazada');
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name as string | undefined;

    console.log(`[Webhook LS] Evento recibido: ${eventName}`);

    // Solo procesamos 'order_created'
    if (eventName !== 'order_created') {
      return NextResponse.json({ received: true, event: eventName }, { status: 200 });
    }

    const orderData = payload.data;
    const attributes = orderData?.attributes as Record<string, unknown> | undefined;
    if (!attributes) {
      console.error('[Webhook LS] Payload inválido — faltan atributos');
      return NextResponse.json({ error: 'Atributos faltantes' }, { status: 400 });
    }

    // ── GUARD: Solo insertar si el pago fue completado (status 'paid') ──
    const orderStatus = attributes.status as string;
    if (orderStatus !== 'paid') {
      console.log(`[Webhook LS] Orden ${orderData.id} ignorada — estado: "${orderStatus}" (solo se procesan órdenes 'paid').`);
      return NextResponse.json({ received: true, status: orderStatus }, { status: 200 });
    }

    // ── Extraer todos los datos de la orden ────────────────────
    const lemonOrderId = orderData.id?.toString() || '';
    const orderNumber  = (attributes.order_number as number | string)?.toString() || '';
    const customerId   = (attributes.customer_id as number | string)?.toString() || '';
    const amount       = typeof attributes.total === 'number' ? attributes.total / 100 : 0;
    const currency     = ((attributes.currency as string) || 'USD').toUpperCase();
    const email        = ((attributes.user_email as string) || '').trim().toLowerCase();

    // ── Extraer datos del alumno desde custom_data ─────────────
    // Estos datos se capturan en el checkout vía checkout_data.custom
    const customData = (payload.meta?.custom_data as Record<string, string>) || {};
    const fullName   = customData.full_name  || (attributes.user_name as string) || 'Desconocido';
    const phone      = customData.phone      || 'N/A';
    const country    = customData.country    || 'N/A';
    const courseName = ((attributes.first_order_item as Record<string, string>)?.product_name) || 'Fade Mastery Elite';

    console.log(`[Webhook LS] Procesando orden ${lemonOrderId} — ${fullName} (${email}) — ${currency} ${amount}`);

    if (!(isSupabaseConfigured() || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
      console.warn('[Webhook LS] ⚠️ Supabase no configurado — orden no guardada.');
      return NextResponse.json({ received: true, warning: 'Supabase no configurado' }, { status: 200 });
    }

    const admin = getSupabaseAdmin();

    // ── Deduplicación: verificar si la orden ya existe ─────────
    const { data: existingOrder } = await admin
      .from('registrations')
      .select('id')
      .eq('lemon_order_id', lemonOrderId)
      .maybeSingle();

    if (existingOrder) {
      console.log(`[Webhook LS] ⚠️ Orden ${lemonOrderId} ya registrada. Omitiendo inserción duplicada.`);
      return NextResponse.json({ received: true, message: 'Orden ya procesada' }, { status: 200 });
    }

    // ── Insertar registro completo — solo aquí, solo si pagó ───
    const { error: insertError } = await admin.from('registrations').insert([{
      full_name:      fullName,
      email:          email,
      phone:          phone,
      country:        country,
      payment_method: 'lemonsqueezy',
      course_name:    courseName,
      amount:         amount,
      currency:       currency,
      status:         'completed',
      lemon_order_id: lemonOrderId,
      customer_id:    customerId,
      order_number:   orderNumber,
      created_at:     new Date().toISOString(),
    }]);

    if (insertError) {
      console.error('[Webhook LS] ❌ Error al insertar en Supabase:', insertError.message);
      // Retornamos 500 para que Lemon Squeezy reintente el webhook automáticamente
      return NextResponse.json({ error: 'Error guardando compra' }, { status: 500 });
    }

    console.log(`[Webhook LS] ✅ Registro guardado — Orden: ${lemonOrderId} | Cliente: ${email}`);
    return NextResponse.json({ received: true, lemonOrderId }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[Webhook LS] ❌ Error no manejado:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
