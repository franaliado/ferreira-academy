import { NextResponse } from 'next/server';
import { getCourseById } from '@/data/currentCourse';
import { checkDuplicateRegistration } from '@/lib/supabase';

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
    const body = (await request.json().catch(() => ({}))) as {
      courseId?: string;
      id?: string;
      countryCode?: string;
      country?: string;
      fullName?: string;
      email?: string;
      phone?: string;
    };
    const courseId = body.courseId || body.id;

    // Servidor determina los datos oficiales del curso
    const course = getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'El curso especificado no existe.' }, { status: 400 });
    }

    if (typeof course.priceAmount !== 'number' || isNaN(course.priceAmount) || course.priceAmount <= 0) {
      return NextResponse.json({ error: 'El precio del curso no es válido.' }, { status: 400 });
    }

    // ── Verificar si el usuario ya está registrado antes de crear orden ──
    if (body.email || body.phone) {
      const duplicateCheck = await checkDuplicateRegistration(body.email || '', body.phone);
      if (duplicateCheck.isDuplicate) {
        return NextResponse.json(
          {
            error: duplicateCheck.message || 'Ya te encuentras registrado/a en este curso con este correo electrónico o número de teléfono.',
            isDuplicate: true,
          },
          { status: 409 }
        );
      }
    }

    const priceValue = course.priceAmount.toFixed(2);
    const currencyCode = (course.currency || 'USD').toUpperCase();
    const courseTitle = course.title || course.name || 'Inscripción a Curso';

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const paypalBase =
      mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    // Construir metadatos personalizados para webhook y captura
    const customMetadata = JSON.stringify({
      course_id: course.id,
      full_name: body.fullName || '',
      email: body.email || '',
      phone: body.phone || '',
      country: body.country || body.countryCode || '',
    });

    // Construir datos del pagador (payer) para que PayPal inicialice el país de facturación
    // con el país seleccionado por el usuario en lugar de forzar España (ES) por defecto
    const payer: Record<string, any> = {};

    if (body.email && typeof body.email === 'string' && body.email.includes('@')) {
      payer.email_address = body.email.trim().toLowerCase();
    }

    if (body.fullName && typeof body.fullName === 'string' && body.fullName.trim()) {
      const parts = body.fullName.trim().split(/\s+/);
      if (parts.length > 1) {
        payer.name = {
          given_name: parts.slice(0, -1).join(' ').slice(0, 140),
          surname: parts[parts.length - 1].slice(0, 140),
        };
      } else if (parts.length === 1 && parts[0]) {
        payer.name = {
          given_name: parts[0].slice(0, 140),
        };
      }
    }

    // Código de país ISO 3166-1 alpha-2 (ej: VE, US, MX, CO, ES, etc.)
    if (body.countryCode && typeof body.countryCode === 'string' && /^[a-zA-Z]{2}$/.test(body.countryCode.trim())) {
      payer.address = {
        country_code: body.countryCode.trim().toUpperCase(),
      };
    }

    const orderPayload: Record<string, any> = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currencyCode,
            value: priceValue,
          },
          description: courseTitle,
          custom_id: customMetadata.slice(0, 127),
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    };

    if (Object.keys(payer).length > 0) {
      orderPayload.payer = payer;
    }

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