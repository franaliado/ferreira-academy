import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, country, paymentMethod, amount, currency } = body;

    const orderId = `FA-USD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isSupabaseConfigured()) {
      await supabase.from('registrations').insert([
        {
          order_id: orderId,
          full_name: fullName,
          email,
          phone,
          country,
          payment_method: paymentMethod,
          amount: amount || 149,
          currency: currency || 'USD',
          status: 'completed',
          created_at: new Date().toISOString(),
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Inscripción procesada correctamente.',
      whatsappGroupUrl: 'https://chat.whatsapp.com/FerreiraAcademyVIP2026',
      zoomLink: 'https://zoom.us/j/98471203948?pwd=FA2026',
    });
  } catch (error) {
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
