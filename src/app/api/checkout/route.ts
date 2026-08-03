import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { currentCourse } from '@/data/currentCourse';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, country, paymentMethod, amount, currency } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (fullName, email).' },
        { status: 400 }
      );
    }

    const orderId = `FA-${currency || currentCourse.currency}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Real Supabase insertion for production
    if (isSupabaseConfigured() || process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = getSupabaseAdmin();

      const normalizedPaymentMethod = paymentMethod === 'paypal' ? 'paypal' : 'lemonsqueezy';
      const fullAmount = Number(currentCourse.priceAmount);

      const { error: regError } = await admin.from('registrations').insert([
        {
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : 'N/A',
          country: country ? country.trim() : 'N/A',
          payment_method: normalizedPaymentMethod,
          course_name: 'Fade Mastery Elite',
          amount: fullAmount,
          status: 'completed',
        },
      ]);

      if (regError) {
        throw new Error(`Supabase insert failed: ${regError.message}`);
      }

      console.log(`[Checkout] ✅ Registration successfully stored in Supabase: ${email}`);
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Inscripción procesada correctamente.',
      whatsappGroupUrl: 'https://chat.whatsapp.com/FerreiraAcademyVIP2026',
      zoomLink: 'https://zoom.us/j/98471203948?pwd=FA2026',
    });
  } catch (error: any) {
    console.error('\n======================================================');
    console.error('🚨 [Checkout] FATAL ERROR 🚨');
    console.error('=> MENSAJE:', error?.message || 'Sin mensaje de error');
    console.error('======================================================\n');
    
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}