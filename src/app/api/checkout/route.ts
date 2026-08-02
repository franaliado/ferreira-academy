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

    // Save to Supabase if configured
    if (isSupabaseConfigured() || process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = getSupabaseAdmin();

        // Insert into registrations table (Primary table for certs & payments)
        const normalizedPaymentMethod = paymentMethod === 'paypal' ? 'paypal' : 'lemonsqueezy';
        
        // Asegurando que se registre siempre el monto completo del curso
        const fullAmount = Number(currentCourse.priceAmount);

        const { error: regError } = await admin.from('registrations').insert([
          {
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : 'N/A', // Ensures NOT NULL constraint
            country: country ? country.trim() : 'N/A', // Ensures NOT NULL constraint
            payment_method: normalizedPaymentMethod,
            course_name: 'Fade Mastery Elite',
            amount: fullAmount,
            status: 'completed',
          },
        ]);

        if (regError) {
          console.error('[Checkout] Failed to save registration:', regError.message);
          throw new Error('Database insert failed');
        } else {
          console.log(`[Checkout] ✅ Registration stored in Supabase: ${email}`);
        }
      } catch (dbError) {
        // Log the error but allow checkout flow to complete gracefully
        console.error('[Checkout] Database error (non-fatal):', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Inscripción procesada correctamente.',
      whatsappGroupUrl: 'https://chat.whatsapp.com/FerreiraAcademyVIP2026',
      zoomLink: 'https://zoom.us/j/98471203948?pwd=FA2026',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Checkout] Unhandled error:', message);

    // Graceful fallback — never leave the user hanging
    return NextResponse.json(
      {
        success: true,
        orderId: `FA-USD-${Math.floor(100000 + Math.random() * 900000)}`,
        message: 'Inscripción procesada correctamente.',
      },
      { status: 200 }
    );
  }
}
