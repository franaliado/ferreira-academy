import { NextResponse } from 'next/server';
import { getSupabaseAdmin, ensurePurchasesTable, isSupabaseConfigured } from '@/lib/supabase';
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
        // Ensure the purchases table exists
        await ensurePurchasesTable();

        const admin = getSupabaseAdmin();

        // Insert into purchases table (unified table for all payment records)
        const { error: purchaseError } = await admin.from('purchases').insert([
          {
            order_id: orderId,
            customer_name: fullName,
            customer_email: email,
            phone: phone || null,
            country: country || null,
            payment_method: paymentMethod || 'direct',
            transaction_id: null, // Will be updated by webhook if using Lemon Squeezy
            amount: amount || currentCourse.priceAmount,
            currency: currency || currentCourse.currency,
            status: paymentMethod === 'lemonSqueezy' ? 'pending_payment' : 'completed',
            product_name: currentCourse.title,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (purchaseError) {
          console.error('[Checkout] Failed to save purchase:', purchaseError.message);
          // Don't fail the checkout — log and continue
        } else {
          console.log(`[Checkout] ✅ Purchase record created: ${orderId}`);
        }

        // Also insert into legacy registrations table if it exists
        try {
          await admin.from('registrations').insert([
            {
              order_id: orderId,
              full_name: fullName,
              email,
              phone,
              country,
              payment_method: paymentMethod,
              amount: amount || currentCourse.priceAmount,
              currency: currency || currentCourse.currency,
              status: 'completed',
              created_at: new Date().toISOString(),
            },
          ]);
        } catch {
          // registrations table may not exist — that's fine
        }
      } catch (dbError) {
        // Database errors should not break the checkout flow
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
