import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// POST /api/paypal/create-order
// Expects JSON body with formData: { fullName, email, phone, country }
// Returns { orderID } for PayPal Smart Buttons.

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
    const { fullName, email, phone, country } = await request.json();
    if (!fullName || !email || !phone || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const purchaseUnit = {
      amount: {
        currency_code: 'USD',
        value: '0.00', // placeholder; replace with actual price if needed
      },
      custom_id: JSON.stringify({ full_name: fullName, email, phone, country }),
    };

    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [purchaseUnit],
      }),
    });

    if (!orderResponse.ok) {
      const errText = await orderResponse.text();
      console.error('PayPal order creation failed', errText);
      return NextResponse.json({ error: 'PayPal order creation failed' }, { status: 500 });
    }
    const orderData = await orderResponse.json() as { id: string };
    return NextResponse.json({ orderID: orderData.id }, { status: 200 });
  } catch (error: any) {
    console.error('Error in PayPal create-order', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/paypal/create-order' });
}
