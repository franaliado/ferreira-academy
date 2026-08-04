import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { currentCourse } from '@/data/currentCourse';

// ─────────────────────────────────────────────────────────────
// POST /api/checkout
//
// Flujo:
// 1. Valida campos del formulario.
// 2. Genera sesión de checkout en Lemon Squeezy o redirige a
//    PayPal con metadatos del alumno en la URL.
// 3. NO guarda nada en Supabase — eso lo hace el webhook.
// 4. Devuelve { success, orderId, checkoutUrl }.
// ─────────────────────────────────────────────────────────────
const LS_API_BASE = 'https://api.lemonsqueezy.com/v1';

function getCountryCode(countryName: string): string | null {
  const map: Record<string, string> = {
    'españa': 'ES',
    'estados unidos': 'US',
    'méxico': 'MX',
    'colombia': 'CO',
    'argentina': 'AR',
    'chile': 'CL',
    'perú': 'PE',
    'brasil': 'BR',
    'ecuador': 'EC',
    'república dominicana': 'DO',
    'venezuela': 'VE',
    'francia': 'FR',
    'italia': 'IT',
    'reino unido': 'GB',
  };
  return map[countryName.toLowerCase().trim()] || null;
}

export async function POST(request: Request) {
  try {
    // ── Extraer y validar campos del frontend ──────────────────
    const body = await request.json();
    const { fullName, email, phone, country, paymentMethod } = body;

    if (!fullName || !email || !phone || !country) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios (nombre, correo, teléfono y país).' },
        { status: 400 }
      );
    }

    // Sanitizar una sola vez
    const cleanName    = fullName.trim();
    const cleanEmail   = email.trim().toLowerCase();
    const cleanPhone   = phone.trim();
    const cleanCountry = country.trim();
    // Valores estandarizados: solo "lemonSqueezy" o "paypal"
    const method       = paymentMethod === 'paypal' ? 'paypal' : 'lemonSqueezy';

    // ── Order ID interno ───────────────────────────────────────
    const orderId = `FA-${currentCourse.currency}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // ── 1. Eliminar inserciones previas en Supabase ─────────────────
    // El registro solo se crea en Supabase cuando el Webhook confirma el pago exitoso.

    let checkoutUrl = '';

    // ── 2a. PAYPAL ─────────────────────────────────────────────
    // Incrustamos los datos del alumno en la URL para que el
    // webhook de PayPal (/api/webhooks/paypal) los recupere.
    if (method === 'paypal') {
      const base = process.env.PAYPAL_CHECKOUT_URL || 'https://www.paypal.com';
      const meta = encodeURIComponent(JSON.stringify({
        full_name: cleanName,
        phone:     cleanPhone,
        country:   cleanCountry,
        order_id:  orderId,
      }));
      checkoutUrl = `${base}?custom=${meta}`;

    // ── 2b. LEMON SQUEEZY — Creación por API o URL oficial ──
    } else {
      const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
      const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
      const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID || currentCourse.lemonSqueezyVariantId;
      const storeUrl = process.env.LEMON_SQUEEZY_STORE_URL || 'https://ferreiraacademy.lemonsqueezy.com';

      const countryCode = getCountryCode(cleanCountry);

      // Si existe API Key y Store ID, creamos sesión mediante la API de Lemon Squeezy
      if (apiKey && storeId && variantId && !variantId.startsWith('variant_')) {
        try {
          const lsRes = await fetch(`${LS_API_BASE}/checkouts`, {
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              data: {
                type: 'checkouts',
                attributes: {
                  checkout_data: {
                    email: cleanEmail,
                    name: cleanName,
                    billing_address: countryCode ? { country: countryCode } : undefined,
                    custom: {
                      full_name: cleanName,
                      phone: cleanPhone,
                      country: cleanCountry,
                      order_id: orderId,
                    },
                  },
                },
                relationships: {
                  store: { data: { type: 'stores', id: String(storeId) } },
                  variant: { data: { type: 'variants', id: String(variantId) } },
                },
              },
            }),
          });

          if (lsRes.ok) {
            const lsData = await lsRes.json();
            checkoutUrl = lsData.data?.attributes?.url || '';
          }
          // Asegurar embed=1 en la URL devuelta para habilitar la apertura en overlay modal
          if (checkoutUrl) {
            try {
              const u = new URL(checkoutUrl);
              u.searchParams.set('embed', '1');
              checkoutUrl = u.toString();
            } catch {}
          }
        } catch (apiErr) {
          console.warn('[Checkout] Falló creación via API, usando fallback:', apiErr);
        }
      }

      // Fallback a URL pública o de tienda de Lemon Squeezy
      if (!checkoutUrl) {
        let rawCheckoutUrl = process.env.LEMON_SQUEEZY_CHECKOUT_URL || currentCourse.lemonSqueezyCheckoutUrl;

        // Si la URL dada contiene variante ficticia, apuntar a la tienda principal de Lemon Squeezy
        if (!rawCheckoutUrl || rawCheckoutUrl.includes('variant_') || rawCheckoutUrl.includes('faded-mastery-2026')) {
          rawCheckoutUrl = storeUrl.replace(/\/$/, '');
        }

        try {
          const urlObj = new URL(rawCheckoutUrl);
          urlObj.searchParams.set('checkout[email]', cleanEmail);
          urlObj.searchParams.set('checkout[name]', cleanName);
          urlObj.searchParams.set('checkout[phone]', cleanPhone);
          if (countryCode) {
            urlObj.searchParams.set('checkout[billing_address][country]', countryCode);
          }
          urlObj.searchParams.set('checkout[custom][full_name]', cleanName);
          urlObj.searchParams.set('checkout[custom][phone]', cleanPhone);
          urlObj.searchParams.set('checkout[custom][country]', cleanCountry);
          urlObj.searchParams.set('checkout[custom][order_id]', orderId);
          urlObj.searchParams.set('embed', '1');

          checkoutUrl = urlObj.toString();
        } catch {
          checkoutUrl = storeUrl;
        }
      }

      console.log('[Checkout] ✅ URL de Lemon Squeezy resuelta:', checkoutUrl);
    }

    // ── 3. Respuesta al frontend ───────────────────────────────
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