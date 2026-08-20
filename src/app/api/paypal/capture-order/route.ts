import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { currentCourse, getFormattedCourseDate } from '@/data/currentCourse';
import { translations, Language } from '@/lib/translations';
import { sendEmail } from '@/lib/email';

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
      lang?: Language;
    };

    const { orderID, certificateName, email, phone, country, courseName, paymentMethod, lang = 'es' } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
    }

    console.log(`[capture-order] *** START *** orderID=${orderID}`);

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    // ── Execute capture ──
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
    });

    let data = null;
    if (captureResponse.ok) {
      data = await captureResponse.json();
    } else {
      const errText = await captureResponse.text().catch(() => '');
      console.error(`[capture-order] *** CAPTURE FAILED *** HTTP ${captureResponse.status}: ${errText}`);
      return NextResponse.json({ success: false, error: 'Capture failed' }, { status: 400 });
    }

    // ── Verify status ──
    const firstPurchaseUnit = data?.purchase_units?.[0];
    const firstCapture = firstPurchaseUnit?.payments?.captures?.[0];
    const isCompleted = data?.status === 'COMPLETED' || firstCapture?.status === 'COMPLETED';

    if (!isCompleted) {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 });
    }

    // ── Extract info ──
    const captureID = firstCapture?.id || 'N/A';
    const amountVal = parseFloat(firstCapture?.amount?.value || String(currentCourse.priceAmount));
    const currencyCode = firstCapture?.amount?.currency_code || currentCourse.currency || 'USD';

    let customMeta: any = {};
    try {
      if (firstPurchaseUnit?.custom_id?.startsWith('{')) {
        customMeta = JSON.parse(firstPurchaseUnit.custom_id);
      }
    } catch {}

    const finalCertName = certificateName || customMeta.full_name || data?.payer?.name?.given_name + ' ' + data?.payer?.name?.surname || 'Participante';
    const finalEmail = (email || customMeta.email || data?.payer?.email_address || '').trim() || 'cliente@ferreiraacademy.com';
    const finalPhone = (phone || customMeta.phone || '').trim();
    const finalCountry = (country || customMeta.country || '').trim();
    const finalCourseName = (courseName || '').trim() || currentCourse.title;

    // ── Supabase ──
    let savedInDb = false;
    if (isSupabaseConfigured() || process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = getSupabaseAdmin();
      const { data: existing } = await admin.from('registrations').select('id').eq('paypal_order_id', orderID).maybeSingle();
      
      if (!existing) {
        const { error: insErr } = await admin.from('registrations').insert({
          certificate_name: finalCertName,
          email: finalEmail,
          phone: finalPhone,
          country: finalCountry,
          course_name: finalCourseName,
          amount: amountVal,
          currency: currencyCode,
          payment_method: normalizePaymentMethod(paymentMethod),
          paypal_order_id: orderID,
          paypal_capture_id: captureID !== 'N/A' ? captureID : null,
        });
        if (!insErr) savedInDb = true;
      }
    }

    // ── Email de Confirmación con Diseño Oscuro y Traducción Multilingüe ──
    try {
      const selectedLang: Language = (lang && translations[lang]) ? lang : 'es';
      const t = translations[selectedLang].confirmationEmail || translations[selectedLang].emailTemplates;
      const formattedDate = getFormattedCourseDate(selectedLang, currentCourse.startDate);
      const modalityText = currentCourse.isPresencial ? t.inPersonModality : t.zoomModality;

      const emailSubject = t.subject.replace('{courseName}', finalCourseName);
      const emailGreeting = t.greeting.replace('{name}', finalCertName);
      const emailMainText = t.mainText.replace('{courseName}', finalCourseName);

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ferreiraacademy.com';
      const logoUrl = 'https://ferreira-academy.vercel.app/Logo_Oficial_Negro.png';

      const emailHtml = `
<!DOCTYPE html>
<html lang="${selectedLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0B0B; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B0B0B; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #16161A; border: 1px solid #2A2A30; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding: 36px 20px 20px 20px; background-color: #0F0F12; border-bottom: 1px solid #222226;">
              <img src="${logoUrl}" alt="Ferreira Academy" width="180" style="display: block; max-width: 180px; height: auto;" />
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <!-- Title Badge -->
              <h1 style="color: #D4AF37; font-size: 20px; font-weight: 700; margin: 0 0 20px 0; text-align: center; text-transform: uppercase; letter-spacing: 1.5px;">
                ${t.title || 'Confirmación de Inscripción'}
              </h1>
              
              <!-- Greeting & Main Message -->
              <p style="color: #FFFFFF; font-size: 17px; font-weight: 600; margin: 0 0 12px 0;">
                ${emailGreeting}
              </p>
              <p style="color: #CCCCCC; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
                ${emailMainText}
              </p>
              
              <!-- Registration Details Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1E1E24; border-left: 4px solid #D4AF37; border-radius: 8px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 10px; color: #888888; font-size: 13px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                          ${t.courseLabel || 'Curso:'}
                        </td>
                        <td style="padding-bottom: 10px; color: #D4AF37; font-size: 14px; font-weight: 700; text-align: right;">
                          ${finalCourseName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #888888; font-size: 13px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                          ${t.participantLabel || 'Participante:'}
                        </td>
                        <td style="padding-bottom: 10px; color: #FFFFFF; font-size: 14px; font-weight: 600; text-align: right;">
                          ${finalCertName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #888888; font-size: 13px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                          ${t.startDateLabel}
                        </td>
                        <td style="padding-bottom: 10px; color: #FFFFFF; font-size: 14px; font-weight: 600; text-align: right;">
                          ${formattedDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: ${finalCountry ? '10px' : '0px'}; color: #888888; font-size: 13px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                          ${t.modalityLabel}
                        </td>
                        <td style="padding-bottom: ${finalCountry ? '10px' : '0px'}; color: #FFFFFF; font-size: 14px; font-weight: 600; text-align: right;">
                          ${modalityText}
                        </td>
                      </tr>
                      ${finalCountry ? `
                      <tr>
                        <td style="color: #888888; font-size: 13px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                          ${t.registeredCountryLabel}
                        </td>
                        <td style="color: #FFFFFF; font-size: 14px; font-weight: 600; text-align: right;">
                          ${finalCountry}
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp Group Callout -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #121E17; border: 1px solid #1F4D2B; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <p style="color: #E2F5EA; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
                      ${t.whatsappNotice}
                    </p>
                    <a href="https://chat.whatsapp.com/G342Zk9K61L30zVbVd5dJj" target="_blank" style="display: inline-block; background-color: #25D366; color: #000000; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 26px; border-radius: 25px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                      ${t.whatsappButton}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px; background-color: #0F0F12; border-top: 1px solid #222226;">
              <p style="color: #666666; font-size: 12px; margin: 0; line-height: 1.5;">
                ${t.footerRights}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      await sendEmail({
        to: finalEmail,
        subject: emailSubject,
        html: emailHtml,
      });
      console.log(`[capture-order] ✅ Email enviado exitosamente a ${finalEmail}`);
    } catch (emailErr: any) {
      console.error(`[capture-order] ⚠️ Error enviando email a ${finalEmail}:`, emailErr?.message || emailErr);
    }

    return NextResponse.json({ success: true, status: 'COMPLETED', savedInDb }, { status: 200 });
  } catch (error: any) {
    console.error('[capture-order] Error fatal:', error?.message, error?.stack);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}