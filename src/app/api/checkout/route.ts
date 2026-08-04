import { NextResponse } from 'next/server';
import { currentCourse } from '@/data/currentCourse';

// ─────────────────────────────────────────────────────────────
// POST /api/checkout
//
// Flujo:
// 1. Valida campos del formulario.
// 2. Genera URL de checkout de PayPal con metadatos del alumno.
// 3. Devuelve { success, orderId, checkoutUrl }.
// ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // ── Extraer y validar campos del frontend ──────────────────
    const body = await request.json();
    const { fullName, email, phone, country } = body;

    if (!fullName || !email || !phone || !country) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios (nombre, correo, teléfono y país).' },
        { status: 400 }
      );
    }

    // Sanitizar datos del cliente
    const cleanName    = fullName.trim();
    const cleanEmail   = email.trim().toLowerCase();
    const cleanPhone   = phone.trim();
    const cleanCountry = country.trim();

    // ── Order ID interno ───────────────────────────────────────
    const orderId = `FA-${currentCourse.currency}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // ── PAYPAL CHECKOUT URL ───────────────────────────────────
    const base = process.env.PAYPAL_CHECKOUT_URL || 'https://www.paypal.com';
    const meta = encodeURIComponent(JSON.stringify({
      full_name: cleanName,
      phone:     cleanPhone,
      country:   cleanCountry,
      order_id:  orderId,
    }));
    const checkoutUrl = `${base}?custom=${meta}`;

    // ── Respuesta al frontend ───────────────────────────────
    return NextResponse.json({
      success: true,
      orderId,
      checkoutUrl,
    });

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido al procesar el checkout.';
    console.error('🚨 [Checkout API Error]:', message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}