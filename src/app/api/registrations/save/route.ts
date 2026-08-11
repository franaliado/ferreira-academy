import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// POST /api/registrations/save
export interface SaveRegistrationPayload {
  certificate_name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  course_name?: string;
  amount: number | string;
  currency: string;
  payment_method: string;
  paypal_order_id: string;
  paypal_capture_id?: string | null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveRegistrationPayload;

    const {
      certificate_name,
      email,
      phone,
      country,
      course_name,
      amount,
      currency,
      payment_method,
      paypal_order_id,
      paypal_capture_id,
    } = body;

    // ── Validación estricta: si certificate_name o email están vacíos, rechazamos ──
    const trimmedCertName = (certificate_name || '').trim();
    if (!trimmedCertName) {
      return NextResponse.json(
        { error: 'El nombre completo es obligatorio.' },
        { status: 400 }
      );
    }

    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !paypal_order_id) {
      return NextResponse.json(
        { error: 'Datos de pago o correo incompletos.' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // ── Deduplicación / Actualización si ya existe por paypal_order_id ──
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('paypal_order_id', paypal_order_id)
      .maybeSingle();

    if (selectError) {
      console.error('[save-registration] Error en select:', selectError);
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount)) || 95.0;

    if (existing) {
      const { error: updateError } = await supabaseAdmin
        .from('registrations')
        .update({
          certificate_name: trimmedCertName,
          email: trimmedEmail,
          phone: phone ? phone.trim() : null,
          country: country ? country.trim() : 'N/A',
          course_name: course_name || 'Faded Mastery Elite 2026',
          amount: numAmount,
          currency: currency || 'USD',
          payment_method: payment_method || 'paypal',
          paypal_capture_id: paypal_capture_id || null,
        })
        .eq('paypal_order_id', paypal_order_id);

      if (updateError) {
        console.error('[save-registration] Error en update:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, updated: true }, { status: 200 });
    }

    // ── Inserción limpia con estructura exacta de la tabla registrations ──
    const { error: insertError } = await supabaseAdmin.from('registrations').insert({
      certificate_name: trimmedCertName,
      email: trimmedEmail,
      phone: phone ? phone.trim() : null,
      country: country ? country.trim() : 'N/A',
      course_name: course_name || 'Faded Mastery Elite 2026',
      amount: numAmount,
      currency: currency || 'USD',
      payment_method: payment_method || 'paypal',
      paypal_order_id: paypal_order_id,
      paypal_capture_id: paypal_capture_id || null,
    });

    if (insertError) {
      console.error('[save-registration] Error de inserción:', insertError);
      return NextResponse.json(
        { 
          error: 'db_error', 
          message: insertError.message, 
          details: insertError.details, 
          hint: insertError.hint 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[save-registration] Error inesperado:', err);
    return NextResponse.json(
      { error: 'unexpected_error', message: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}