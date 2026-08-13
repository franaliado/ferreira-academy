import { NextResponse } from 'next/server';
import { getCourseById } from '@/data/currentCourse';

// POST /api/paypal/create-order
// Creates a PayPal order and returns its ID

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
    const errorText = await response.text();
    console.error('PayPal token request failed:', errorText);
    throw new Error(`PayPal token request failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { courseId?: string; id?: string };
    const courseId = body.courseId || body.id;

    // Servidor determina los datos oficiales del curso
    const course = getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'El curso especificado no existe.' }, { status: 400 });
    }

    if (typeof course.priceAmount !== 'number' || isNaN(course.priceAmount) || course.priceAmount <= 0) {
      return NextResponse.json({ error: 'El precio del curso no es válido.' }, { status: 400 });
    }

    const priceValue = course.priceAmount.toFixed(2);
    const currencyCode = (course.currency || 'USD').toUpperCase();
    const courseTitle = course.title || course.name || 'Inscripción a Curso';

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const paypalBase =
      mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currencyCode,
            value: priceValue,
          },
          description: courseTitle,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
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

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error('PayPal order creation failed details:', orderData);
      return NextResponse.json(
        { error: orderData.message || 'PayPal order creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: orderData.id }, { status: 200 });
  } catch (error: any) {
    console.error('Error in PayPal create-order:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/paypal/create-order' });
}