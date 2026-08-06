import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// POST /api/registrations/save
// Saves a confirmed registration to Supabase after a COMPLETED PayPal payment.
// Must only be called after a successful payment capture with status === 'COMPLETED'.

export interface SaveRegistrationPayload {
  // Data from PayPal capture
  paypal_order_id: string;
  payer_id: string;
  buyer_name: string;
  email: string;
  phone: string | null;
  country: string;
  payment_method: 'paypal' | 'card';
  amount: string;
  currency: string;
  // Data from user input
  certificate_name: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveRegistrationPayload;

    const {
      paypal_order_id,
      payer_id,
      buyer_name,
      email,
      phone,
      country,
      payment_method,
      amount,
      currency,
      certificate_name,
    } = body;

    // ── Validate required fields ───────────────────────────────
    if (!paypal_order_id || !email || !certificate_name) {
      return NextResponse.json(
        { error: 'Missing required fields: paypal_order_id, email, certificate_name' },
        { status: 400 }
      );
    }

    const trimmedCertName = certificate_name.trim();
    if (!trimmedCertName) {
      return NextResponse.json(
        { error: 'certificate_name cannot be empty' },
        { status: 400 }
      );
    }
    if (trimmedCertName.length > 150) {
      return NextResponse.json(
        { error: 'certificate_name exceeds maximum length of 150 characters' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // ── Duplicate check: verify no existing record with same paypal_order_id ──
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('registrations')
      .select('id, paypal_order_id')
      .eq('paypal_order_id', paypal_order_id)
      .maybeSingle();

    if (selectError) {
      console.error('[save-registration] Error checking duplicate:', selectError);
      return NextResponse.json(
        { error: 'Error verifying order. Please contact support.' },
        { status: 500 }
      );
    }

    if (existing) {
      // Already registered — return a specific code so the client knows
      return NextResponse.json(
        {
          error: 'duplicate',
          message: 'Esta orden ya fue registrada anteriormente.',
        },
        { status: 409 }
      );
    }

    // ── Insert registration ────────────────────────────────────
    const { error: insertError } = await supabaseAdmin.from('registrations').insert({
      // PayPal data
      paypal_order_id,
      payer_id: payer_id || null,
      buyer_name: buyer_name || null,
      // legacy full_name kept for backwards compatibility
      full_name: buyer_name || 'N/A',
      email,
      phone: phone || null,
      country: country || 'N/A',
      payment_method,
      amount: parseFloat(amount) || 95.0,
      currency: currency || 'USD',
      // Course data
      course_name: 'Fade Mastery Elite',
      // User-provided certificate name
      certificate_name: trimmedCertName,
      // Status
      status: 'paid',
      certificate_sent: false,
    });

    if (insertError) {
      console.error('[save-registration] Supabase insert error:', insertError);

      // Handle unique constraint violation (paypal_order_id) gracefully
      if (
        insertError.code === '23505' &&
        insertError.message?.includes('paypal_order_id')
      ) {
        return NextResponse.json(
          {
            error: 'duplicate',
            message: 'Esta orden ya fue registrada anteriormente.',
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: 'db_error',
          message:
            'Tu pago fue recibido correctamente, pero ocurrió un problema registrando tu inscripción. Nuestro equipo revisará tu caso.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[save-registration] Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'unexpected_error',
        message:
          'Tu pago fue recibido correctamente, pero ocurrió un problema registrando tu inscripción. Nuestro equipo revisará tu caso.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/registrations/save' });
}
