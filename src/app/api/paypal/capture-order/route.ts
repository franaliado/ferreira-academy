import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Asegúrate de que esta ruta apunte a tu cliente de supabase

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
    const { orderID, certificateName, courseName } = await request.json() as { 
      orderID: string; 
      certificateName?: string; 
      courseName?: string; 
    };

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!captureResponse.ok) {
      const errText = await captureResponse.text();
      console.error('PayPal capture order failed:', errText);
      return NextResponse.json({ error: 'PayPal order capture failed' }, { status: 500 });
    }

    const data = await captureResponse.json() as {
      id: string;
      status: string;
      payer?: {
        payer_id?: string;
        email_address?: string;
        name?: { given_name?: string; surname?: string };
        phone?: { phone_number?: { national_number?: string } };
        address?: { country_code?: string };
      };
      purchase_units?: Array<{
        shipping?: { address?: { country_code?: string } };
        payments?: {
          captures?: Array<{
            id: string;
            status: string;
            amount?: { value: string; currency_code: string };
          }>;
        };
      }>;
    };

    const firstPurchaseUnit = data.purchase_units?.[0];
    const firstCapture = firstPurchaseUnit?.payments?.captures?.[0];
    const captureID = firstCapture?.id || 'N/A';
    const amountVal = parseFloat(firstCapture?.amount?.value || '95.00');
    const currencyCode = firstCapture?.amount?.currency_code || 'USD';
    const payerEmail = data.payer?.email_address || 'unknown@paypal.com';
    const givenName = data.payer?.name?.given_name || '';
    const surname = data.payer?.name?.surname || '';
    const payerName = `${givenName} ${surname}`.trim() || 'PayPal User';
    const payerID = data.payer?.payer_id || '';
    const rawPhone = data.payer?.phone?.phone_number?.national_number;
    const payerPhone = rawPhone || null;
    const payerCountry = data.payer?.address?.country_code || firstPurchaseUnit?.shipping?.address?.country_code || 'N/A';

    // Inserción directa en Supabase adaptada 100% a las columnas de tu tabla
    const { error: dbError } = await supabase.from('registrations').insert([
      {
        buyer_name: payerName,
        email: payerEmail,
        phone: payerPhone,
        country: payerCountry,
        certificate_name: certificateName || payerName, // Usa el del input o el nombre del pagador por defecto
        course_name: courseName || 'Fade Mastery Elite (Presencial)',
        amount: amountVal,
        currency: currencyCode,
        payment_method: 'PayPal',
        status: data.status,
        paypal_order_id: data.id,
        payer_id: payerID,
        certificate_sent: false,
      },
    ]);

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json({ error: 'Payment captured, but database registration failed: ' + dbError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        status: data.status,
        orderID: data.id,
        captureID,
        amount: amountVal,
        currency: currencyCode,
        payerEmail,
        payerName,
        payerID,
        payerPhone,
        payerCountry,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in PayPal capture-order:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/paypal/capture-order' });
}