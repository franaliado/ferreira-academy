import { NextResponse } from 'next/server';
import { getSupabaseAdmin, checkDuplicateRegistration } from '@/lib/supabase';
import { currentCourse } from '@/data/currentCourse';

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

function normalizePaymentMethod(method?: string): 'paypal' | 'credit_card' | 'debit_card' {
  if (method) {
    const m = method.trim().toLowerCase();
    if (m === 'paypal') return 'paypal';
    if (m === 'credit_card') return 'credit_card';
    if (m === 'debit_card') return 'debit_card';
    if (m === 'card') return 'credit_card';
  }
  return 'paypal';
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

    if (!paypal_order_id) {
      return NextResponse.json(
        { error: 'ID de orden de PayPal obligatorio.' },
        { status: 400 }
      );
    }

    const trimmedCertName = (certificate_name || '').trim() || 'Participante';
    const trimmedEmail = (email || '').trim() || 'cliente@ferreiraacademy.com';
    const trimmedPhone = (phone || '').trim();
    const trimmedCountry = (country || '').trim();

    if (!trimmedPhone || !trimmedCountry) {
      return NextResponse.json(
        { error: 'Teléfono y país son obligatorios.' },
        { status: 400 }
      );
    }

    const finalPaymentMethod = normalizePaymentMethod(payment_method);
    const finalCourseName = (course_name || '').trim() || currentCourse.title;
    const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount)) || currentCourse.priceAmount;
    const finalCurrency = (currency || currentCourse.currency || 'USD').toUpperCase();

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

    if (existing) {
      const { error: updateError } = await supabaseAdmin
        .from('registrations')
        .update({
          certificate_name: trimmedCertName,
          email: trimmedEmail,
          phone: trimmedPhone,
          country: trimmedCountry,
          course_name: finalCourseName,
          amount: numAmount,
          currency: finalCurrency,
          payment_method: finalPaymentMethod,
          paypal_capture_id: paypal_capture_id || null,
        })
        .eq('paypal_order_id', paypal_order_id);

      if (updateError) {
        console.error('[save-registration] Error en update:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, updated: true }, { status: 200 });
    }

    // ── VALIDACIÓN ESTRICTA DE DUPLICADOS ANTES DE INSERTAR (POR EMAIL O TELÉFONO) ──
    const duplicateCheck = await checkDuplicateRegistration(
      trimmedEmail,
      trimmedPhone,
      paypal_order_id
    );

    if (duplicateCheck.isDuplicate) {
      console.warn(`[save-registration] Inserción cancelada por duplicado: ${trimmedEmail} / ${trimmedPhone}`);
      return NextResponse.json(
        {
          error: 'duplicate_registration',
          message: duplicateCheck.message || 'Ya te encuentras registrado/a en este curso con este correo electrónico o número de teléfono.',
          field: duplicateCheck.field,
        },
        { status: 409 }
      );
    }

    // ── Inserción limpia con estructura exacta de la tabla registrations ──
    const { error: insertError } = await supabaseAdmin.from('registrations').insert({
      certificate_name: trimmedCertName,
      email: trimmedEmail,
      phone: trimmedPhone,
      country: trimmedCountry,
      course_name: finalCourseName,
      amount: numAmount,
      currency: finalCurrency,
      payment_method: finalPaymentMethod,
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