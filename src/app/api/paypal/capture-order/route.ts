import { NextResponse } from 'next/server';

// POST /api/paypal/capture-order
// Captures a approved PayPal order without saving to Supabase

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
    const { orderID } = await request.json() as { orderID: string };

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
        email_address?: string;
        name?: { given_name?: string; surname?: string };
      };
      purchase_units?: Array<{
        payments?: {
          captures?: Array<{
            id: string;
            status: string;
            amount?: { value: string; currency_code: string };
          }>;
        };
      }>;
    };

    const firstCapture = data.purchase_units?.[0]?.payments?.captures?.[0];
    const captureID = firstCapture?.id || 'N/A';
    const amount = firstCapture?.amount?.value || '95.00';
    const currency = firstCapture?.amount?.currency_code || 'USD';
    const payerEmail = data.payer?.email_address || 'N/A';
    const givenName = data.payer?.name?.given_name || '';
    const surname = data.payer?.name?.surname || '';
    const payerName = `${givenName} ${surname}`.trim() || 'N/A';

    return NextResponse.json(
      {
        status: data.status,
        orderID: data.id,
        captureID,
        amount,
        currency,
        payerEmail,
        payerName,
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
