import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured, checkDuplicateRegistration } from '@/lib/supabase';
import { currentCourse } from '@/data/currentCourse';
import { sendRegistrationEmail } from '@/lib/web3forms';

function normalizePaymentMethod(method?: string, isCardFlag?: boolean): 'paypal' | 'credit_card' | 'debit_card' {
  if (method) {
    const m = method.trim().toLowerCase();
    if (m === 'paypal') return 'paypal';
    if (m === 'credit_card') return 'credit_card';
    if (m === 'debit_card') return 'debit_card';
    if (m === 'card') return 'credit_card';
  }
  if (isCardFlag) return 'credit_card';
  return 'paypal';
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not configured.');
  }

  const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`PayPal token request failed: ${response.status}`);
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as { 
      orderID?: string; 
      certificateName?: string; 
      email?: string;
      phone?: string | null;
      country?: string | null;
      courseName?: string;
      paymentMethod?: string;
    };

    const { orderID, certificateName, email, phone, country, courseName, paymentMethod } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
    }

    console.log(`[capture-order] *** START *** orderID=${orderID} paymentMethod=${paymentMethod || 'unknown'}`);

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    // ── STEP 1: GET order status before capture (for debug) ──
    const getOrderRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (getOrderRes.ok) {
      const orderInfo = await getOrderRes.json() as { status?: string; intent?: string; payment_source?: any };
      console.log(`[capture-order] Pre-capture: status="${orderInfo.status}" intent="${orderInfo.intent}" payment_source_keys=${JSON.stringify(Object.keys(orderInfo.payment_source || {}))}`);
    } else {
      console.warn(`[capture-order] Could not GET order pre-capture: ${getOrderRes.status}`);
    }

    let data: any = null;

    // ── STEP 2: Execute capture ──
    console.log(`[capture-order] POST /v2/checkout/orders/${orderID}/capture`);
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'PayPal-Request-Id': `capture-${orderID}`,
      },
      body: null,
    });

    const debugId = captureResponse.headers.get('paypal-debug-id') || 'n/a';

    if (captureResponse.ok) {
      data = await captureResponse.json();
      console.log(
        `[capture-order] Capture HTTP ${captureResponse.status} OK. ` +
        `order.status="${data?.status}" ` +
        `captures=${JSON.stringify(data?.purchase_units?.[0]?.payments?.captures?.map((c: any) => ({ id: c.id, status: c.status })))} ` +
        `debug_id=${debugId}`
      );
    } else {
      const errText = await captureResponse.text().catch(() => '');
      let errJson: any = {};
      try { errJson = JSON.parse(errText); } catch {}

      // Full error logging
      console.error(
        `[capture-order] *** CAPTURE FAILED *** HTTP ${captureResponse.status} debug_id=${debugId}\n` +
        `  name="${errJson?.name}" message="${errJson?.message}"\n` +
        `  details=${JSON.stringify(errJson?.details)}\n` +
        `  orderID=${orderID}`
      );

      // Handle ORDER_ALREADY_CAPTURED (422)
      const alreadyCaptured =
        captureResponse.status === 422 &&
        (errJson?.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED' ||
          errText.includes('ORDER_ALREADY_CAPTURED'));

      if (alreadyCaptured) {
        console.log(`[capture-order] ORDER_ALREADY_CAPTURED — fetching existing order.`);
        const existingRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}`, {
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        });
        if (existingRes.ok) {
          data = await existingRes.json();
          console.log(`[capture-order] Fetched existing order status="${data?.status}"`);
        }
      }

      // Handle INSTRUMENT_DECLINED (card rejected by issuer)
      const instrumentDeclined =
        captureResponse.status === 422 &&
        (errJson?.details?.[0]?.issue === 'INSTRUMENT_DECLINED' ||
          errText.includes('INSTRUMENT_DECLINED'));

      if (instrumentDeclined) {
        return NextResponse.json(
          {
            success: false,
            error: 'La tarjeta fue rechazada. Verifica los datos o usa otra tarjeta.',
            paypal: { name: errJson?.name, message: errJson?.message, debug_id: debugId, details: errJson?.details },
          },
          { status: 422 }
        );
      }

      if (!data) {
        return NextResponse.json(
          {
            success: false,
            error: 'No se pudo procesar el cobro con PayPal. Intente de nuevo.',
            paypal: { name: errJson?.name, message: errJson?.message, debug_id: debugId, details: errJson?.details },
          },
          { status: 400 }
        );
      }
    }

    // ── STEP 3: Verify COMPLETED status ──
    const firstPurchaseUnit = data?.purchase_units?.[0];
    const firstCapture = firstPurchaseUnit?.payments?.captures?.[0];
    const isCompleted = data?.status === 'COMPLETED' || firstCapture?.status === 'COMPLETED';

    console.log(`[capture-order] isCompleted=${isCompleted} order.status="${data?.status}" capture.status="${firstCapture?.status}"`);

    if (!isCompleted) {
      console.error(`[capture-order] Order ${orderID} NOT completed. order.status="${data?.status}" capture.status="${firstCapture?.status}"`);
      return NextResponse.json(
        {
          success: false,
          error: 'El pago no fue completado por PayPal. Estado: ' + (data?.status || 'Desconocido'),
          paypal: { order_status: data?.status, capture_status: firstCapture?.status },
        },
        { status: 400 }
      );
    }

    // ── STEP 4: Extract payment info ──
    const captureID = firstCapture?.id || 'N/A';
    const amountVal = parseFloat(firstCapture?.amount?.value || firstPurchaseUnit?.amount?.value || String(currentCourse.priceAmount));
    const currencyCode = firstCapture?.amount?.currency_code || firstPurchaseUnit?.amount?.currency_code || currentCourse.currency || 'USD';

    let customMeta: any = {};
    if (firstPurchaseUnit?.custom_id) {
      try {
        if (firstPurchaseUnit.custom_id.startsWith('{')) {
          customMeta = JSON.parse(firstPurchaseUnit.custom_id);
        }
      } catch {}
    }

    const cardInfo = data?.payment_source?.card;
    const paypalInfo = data?.payment_source?.paypal;
    const cardName = cardInfo?.name || '';
    const cardEmail = cardInfo?.email_address || '';
    const givenName = data?.payer?.name?.given_name || paypalInfo?.name?.given_name || '';
    const surname = data?.payer?.name?.surname || paypalInfo?.name?.surname || '';
    const paypalName = `${givenName} ${surname}`.trim();

    const finalCertName =
      certificateName || customMeta.full_name || paypalName || cardName ||
      firstPurchaseUnit?.shipping?.name?.full_name || 'Participante';

    const rawPayerEmail =
      email || customMeta.email || data?.payer?.email_address ||
      cardEmail || paypalInfo?.email_address || '';
    const finalEmail = rawPayerEmail.trim() || 'cliente@ferreiraacademy.com';

    const finalPhone = (phone || customMeta.phone || data?.payer?.phone?.phone_number?.national_number || '').trim();
    const finalCountry = (country || customMeta.country || data?.payer?.address?.country_code ||
      firstPurchaseUnit?.shipping?.address?.country_code || '').trim();
    const finalCourseName = (courseName || '').trim() || currentCourse.title;

    const isCard = !!cardInfo || paymentMethod === 'card' || paymentMethod === 'credit_card' || paymentMethod === 'debit_card';
    const finalPaymentMethod = normalizePaymentMethod(paymentMethod, isCard);
    const payerID = data?.payer?.payer_id || '';

    if (!finalPhone || !finalCountry) {
      console.error(`[capture-order] Missing required phone or country: phone="${finalPhone}", country="${finalCountry}"`);
      return NextResponse.json(
        { success: false, error: 'Se requieren teléfono y país válidos para registrar la inscripción.' },
        { status: 400 }
      );
    }

    console.log(`[capture-order] Payment confirmed. captureID=${captureID} amount=${amountVal} currency=${currencyCode} method=${finalPaymentMethod}`);

    // ── STEP 5: Insert into Supabase ──
    let savedInDb = false;
    try {
      if (isSupabaseConfigured() || process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const admin = getSupabaseAdmin();

        const { data: existing } = await admin
          .from('registrations')
          .select('id')
          .eq('paypal_order_id', orderID)
          .maybeSingle();

        if (existing) {
          const { error: updErr } = await admin
            .from('registrations')
            .update({
              certificate_name: finalCertName,
              email: finalEmail,
              phone: finalPhone,
              country: finalCountry,
              course_name: finalCourseName,
              amount: amountVal,
              currency: currencyCode,
              payment_method: finalPaymentMethod,
              paypal_capture_id: captureID !== 'N/A' ? captureID : null,
            })
            .eq('paypal_order_id', orderID);
          if (updErr) {
            console.error('[capture-order] Supabase UPDATE error:', updErr.message, '| code:', (updErr as any).code, '| details:', updErr.details, '| hint:', updErr.hint);
          } else {
            savedInDb = true;
            console.log(`[capture-order] Supabase UPDATED for orderID=${orderID}`);
          }
        } else {
          // ── VALIDAR DUPLICADOS ANTES DE INSERTAR ──
          const duplicateCheck = await checkDuplicateRegistration(
            finalEmail,
            finalPhone,
            orderID
          );

          if (duplicateCheck.isDuplicate) {
            console.warn(`[capture-order] Registro duplicado detectado para ${finalEmail} / ${finalPhone}. Omitiendo inserción.`);
            return NextResponse.json(
              {
                success: false,
                error: 'duplicate_registration',
                message: duplicateCheck.message || 'Ya te encuentras registrado/a en este curso con este correo o número de teléfono.',
                field: duplicateCheck.field,
              },
              { status: 409 }
            );
          }

          const { error: insErr } = await admin.from('registrations').insert({
            certificate_name: finalCertName,
            email: finalEmail,
            phone: finalPhone,
            country: finalCountry,
            course_name: finalCourseName,
            amount: amountVal,
            currency: currencyCode,
            payment_method: finalPaymentMethod,
            paypal_order_id: orderID,
            paypal_capture_id: captureID !== 'N/A' ? captureID : null,
          });
          if (insErr) {
            console.error('[capture-order] Supabase INSERT error:', insErr.message, '| code:', (insErr as any).code, '| details:', insErr.details, '| hint:', insErr.hint);
          } else {
            savedInDb = true;
            console.log(`[capture-order] Supabase INSERTED for orderID=${orderID}`);
          }
        }
      } else {
        console.warn('[capture-order] Supabase not configured — skipping DB insert.');
      }
    } catch (dbErr) {
      console.error('[capture-order] Unexpected DB error:', dbErr);
    }

    console.log(`[capture-order] *** DONE *** orderID=${data.id} captureID=${captureID} savedInDb=${savedInDb}`);

    // ── STEP 6: Enviar correo de confirmación automático via Web3Forms ──
    sendRegistrationEmail({
      certificateName: finalCertName,
      email: finalEmail,
      phone: finalPhone,
      country: finalCountry,
      courseName: finalCourseName,
      amount: amountVal,
      currency: currencyCode,
      paymentMethod: finalPaymentMethod,
      orderId: data.id || orderID,
    }).catch((emailErr) => {
      console.error('[capture-order] Error no bloqueante al enviar correo Web3Forms:', emailErr);
    });

    return NextResponse.json(
      {
        success: true,
        status: 'COMPLETED',
        orderID: data.id,
        captureID,
        amount: amountVal,
        currency: currencyCode,
        payerEmail: finalEmail,
        payerName: finalCertName,
        payerID,
        payerPhone: finalPhone,
        payerCountry: finalCountry,
        paymentMethod: finalPaymentMethod,
        savedInDb,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[capture-order] Unexpected error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/paypal/capture-order' });
}