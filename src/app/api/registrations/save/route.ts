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
    const finalCourseName = (course_name