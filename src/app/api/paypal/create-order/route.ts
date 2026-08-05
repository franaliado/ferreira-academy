import { NextResponse } from 'next/server';

// POST /api/paypal/create-order
// Creates a PayPal order for 95 USD (Fade Mastery Elite)
// Returns approveUrl — the official PayPal Checkout URL to redirect the browser to.

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not configured.');
  }

  const baseUrl =
    mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

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

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    // Derive the site origin from the incoming request so it works
    // in localhost, staging and production without hardcoding a URL.
    const requestUrl = new URL(request.url);
    const siteOrigin = `${requestUrl.protocol}//${requestUrl.host}`;

    const returnUrl = `${siteOrigin}/?paypal_status=success`;
    const cancelUrl = `${siteOrigin}/?paypal_status=cancel`;

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const paypalBase =
      mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: 'Capacitación Presencial Fade Mastery Elite',
          amount: {
            currency_code: 'USD',
            value: '95.00',
            breakdown: {
              item_total: { currency_code: 'USD', value: '95.00' },
            },
          },
          items: [
            {
              name: 'Fade Mastery Elite',
              description: 'Capacitación Presencial Fade Mastery Elite',
              quantity: '1',
              unit_amount: { currency_code: 'USD', value: '95.00' },
              category: 'DIGITAL_GOODS',
            },
          ],
        },
      ],
      // application_context tells PayPal where to redirect the user
      // after approval or cancellation — this is required for the
      // standard redirect-based Checkout flow.
      application_context: {
        brand_name: 'Ferreira Academy',
        locale: 'es-VE',
        landing_page: 'LOGIN',       // shows PayPal login first
        user_action: 'PAY_NOW',      // label on the final confirm button
        shipping_preference: 'NO_SHIPPING',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    };

    const orderResponse = await fetch(`${paypalBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderResponse.ok) {
      const errText = await orderResponse.text();
      console.error('PayPal order creation failed:', errText);
      return NextResponse.json({ error: 'PayPal order creation failed' }, { status: 500 });
    }

    const orderData = (await orderResponse.json()) as {
      id: string;
      links?: Array<{ rel: string; href: string; method: string }>;
    };

    // The "approve" link is PayPal's official Checkout URL.
    // Redirecting the browser here opens PayPal's own UI.
    const approveLink = orderData.links?.find((l) => l.rel === 'approve')?.href;

    if (!approveLink) {
      console.error('PayPal did not return an approve link. Full response:', orderData);
      return NextResponse.json(
        { error: 'PayPal did not return a checkout URL' },
        { status: 500 }
      );
    }

    console.log(`[PayPal] Order created: ${orderData.id}`);
    return NextResponse.json({ orderID: orderData.id, approveUrl: approveLink }, { status: 200 });
  } catch (error: any) {
    console.error('Error in PayPal create-order:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/paypal/create-order' });
}
