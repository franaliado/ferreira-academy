import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// POST /api/registrations/save
export interface SaveRegistrationPayload {
  paypal_order_id: string;
  payer_id: string;
  buyer_name: string;
  email: string;
  phone: string | null;
  country: string;
  payment_method: 'paypal' | 'card';
  amount: string;
  currency: string;
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

    // ── Validación estricta: si certificate_name viene vacío, rechazamos la petición
    const trimmedCertName = (certificate_name || '').trim();
    if (!trimmedCertName) {
      return NextResponse.json(
        { error: 'El nombre para el certificado es obligatorio. Por favor, escribe un nombre.' },
        { status: 400 }
      );
    }
    
    if (trimmedCertName.length > 150) {
      return NextResponse.json(
        { error: 'El nombre excede el límite de 150 caracteres.' },
        { status: 400 }
      );
    }

    if (!paypal_order_id || !email) {
      return NextResponse.json(
        { error: 'Datos de pago incompletos.' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // ── Verificar si ya existe el registro ──
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('registrations')
      .select('id, paypal_order_id, buyer_name')
      .eq('paypal_order_id', paypal_order_id)
      .maybeSingle();

    if (selectError) {
      console.error('[save-registration] Error en select:', selectError);
      return NextResponse.json({ error: selectError.message, details: selectError.details }, { status: 500 });
    }

    if (existing) {
      const { error: updateError } = await supabaseAdmin
        .from('registrations')
        .update({
          certificate_name: trimmedCertName,
          course_name: 'Fade Mastery Elite',
          buyer_name: buyer_name || existing.buyer_name,
          email: email,
        })
        .eq('paypal_order_id', paypal_order_id);

      if (updateError) {
        console.error('[save-registration] Error en update:', updateError);
        return NextResponse.json({ error: updateError.message, details: updateError.details }, { status: 500 });
      }
      return NextResponse.json({ success: true, updated: true }, { status: 200 });
    }

    // ── Inserción limpia ──
    const { error: insertError } = await supabaseAdmin.from('registrations').insert({
      paypal_order_id,
      payer_id: payer_id || null,
      buyer_name: buyer_name || null,
      email,
      phone: phone || null,
      country: country || 'N/A',
      payment_method,
      amount: parseFloat(amount) || 95.0,
      currency: currency || 'USD',
      course_name: 'Fade Mastery Elite',
      certificate_name: trimmedCertName,
      status: 'paid',
      certificate_sent: false,
    });

    if (insertError) {
      console.error('[save-registration] Error de inserción:', insertError);
      // Retornamos el mensaje real y detalles de Supabase para depurar el error 500 al instante
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