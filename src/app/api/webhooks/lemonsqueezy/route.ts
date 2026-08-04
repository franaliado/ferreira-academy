// Este endpoint ya no está en uso.
// Toda la lógica de pagos fue migrada a PayPal.
// El handler activo se encuentra en: /api/webhooks/paypal/route.ts

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json(
    { received: false, message: 'Este endpoint está desactivado. Usa /api/webhooks/paypal en su lugar.' },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json({
    status: 'disabled',
    message: 'Endpoint de Lemon Squeezy desactivado. Pagos gestionados por PayPal.',
    timestamp: new Date().toISOString(),
  });
}
