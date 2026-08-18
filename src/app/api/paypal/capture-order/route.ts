import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { currentCourse } from '@/data/currentCourse';
import { Language } from '@/lib/translations';
import { sendEmail } from '@/lib/email';

function normalizePaymentMethod(method?: string, isCardFlag?: boolean): 'paypal' | 'credit_card' | 'debit_card' {
  if (method) {
    const m = method.trim().toLowerCase();
    if (m === 'paypal') return 'paypal';
    if (m === 'credit_card') return 'credit_card';
    if (m === 'debit_card') return 'debit_card';
    if (m === 'card') return 'credit_card';
  }
  if (isCardFlag) return 'credit_card';
  return 'paypal';
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not configured.');
  }

  const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`PayPal token request failed: ${response.status}`);
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as { 
      orderID?: string; 
      certificateName?: string; 
      email?: string;
      phone?: string | null;
      country?: string | null;
      courseName?: string;
      paymentMethod?: string;
      lang?: Language;
    };

    const { orderID, certificateName, email, phone, country, courseName, paymentMethod, lang = 'es' } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
    }

    console.log(`[capture-order] *** START *** orderID=${orderID}`);

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    // ── Execute capture ──
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
    });

    let data = null;
    if (captureResponse.ok) {
      data = await captureResponse.json();
    } else {
      const errText = await captureResponse.text().catch(() => '');
      console.error(`[capture-order] *** CAPTURE FAILED *** HTTP ${captureResponse.status}: ${errText}`);
      return NextResponse.json({ success: false, error: 'Capture failed' }, { status: 400 });
    }

    // ── Verify status ──
    const firstPurchaseUnit = data?.purchase_units?.[0];
    const firstCapture = firstPurchaseUnit?.payments?.captures?.[0];
    const isCompleted = data?.status === 'COMPLETED' || firstCapture?.status === 'COMPLETED';

    if (!isCompleted) {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 });
    }

    // ── Extract info ──
    const captureID = firstCapture?.id || 'N/A';
    const amountVal = parseFloat(firstCapture?.amount?.value || String(currentCourse.priceAmount));
    const currencyCode = firstCapture?.amount?.currency_code || currentCourse.currency || 'USD';

    let customMeta: any = {};
    try {
      if (firstPurchaseUnit?.custom_id?.startsWith('{')) {
        customMeta = JSON.parse(firstPurchaseUnit.custom_id);
      }
    } catch {}

    const finalCertName = certificateName || customMeta.full_name || data?.payer?.name?.given_name + ' ' + data?.payer?.name?.surname || 'Participante';
    const finalEmail = (email || customMeta.email || data?.payer?.email_address || '').trim() || 'cliente@ferreiraacademy.com';
    const finalPhone = (phone || customMeta.phone || '').trim();
    const finalCountry = (country || customMeta.country || '').trim();
    const finalCourseName = (courseName || '').trim() || currentCourse.title;

    // ── Supabase ──
    let savedInDb = false;
    if (isSupabaseConfigured() || process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = getSupabaseAdmin();
      const { data: existing } = await admin.from('registrations').select('id').eq('paypal_order_id', orderID).maybeSingle();
      
      if (!existing) {
        const { error: insErr } = await admin.from('registrations').insert({
          certificate_name: finalCertName,
          email: finalEmail,
          phone: finalPhone,
          country: finalCountry,
          course_name: finalCourseName,
          amount: amountVal,
          currency: currencyCode,
          payment_method: normalizePaymentMethod(paymentMethod),
          paypal_order_id: orderID,
          paypal_capture_id: captureID !== 'N/A' ? captureID : null,
        });
        if (!insErr) savedInDb = true;
      }
    }

    // ── Email ──
    await sendEmail({
      to: finalEmail,
      subject: `Confirmación de inscripción - ${finalCourseName}`,
      html: `<p>Hola ${finalCertName}, gracias por inscribirte en ${finalCourseName}.</p>`,
    });
    console.log(`[capture-order] ✅ Email enviado exitosamente a ${finalEmail}`);

    return NextResponse.json({ success: true, status: 'COMPLETED', savedInDb }, { status: 200 });
  } catch (error: any) {
    console.error('[capture-order] Error fatal:', error?.message, error?.stack);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}