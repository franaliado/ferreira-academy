import { currentCourse, getFormattedCourseDate } from '@/data/currentCourse';

export const WHATSAPP_VIP_URL = 'https://chat.whatsapp.com/DYZZgiY5rm4Imls1wGIZzy?s=cl&p=a&ilr=1';
export const WEB3FORMS_ACCESS_KEY = 'e6f63289-2871-492d-810f-b2acb4b0e54e';
export const ACADEMY_EMAIL = 'ferreiraacademy.oficial@gmail.com';

export interface SendRegistrationEmailParams {
  certificateName: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  courseName?: string;
  startDate?: string;
  amount?: number | string;
  currency?: string;
  paymentMethod?: string;
  orderId?: string;
}

/**
 * Genera la plantilla HTML responsive para el correo de confirmación
 * con la identidad visual oficial de Ferreira Academy (negro carbón + dorado premium).
 */
export function generateRegistrationEmailHtml(params: {
  participantName: string;
  courseTitle: string;
  formattedStartDate: string;
  whatsappLink: string;
  phone?: string | null;
  country?: string | null;
  amount?: number | string;
  currency?: string;
  orderId?: string;
}): string {
  const {
    participantName,
    courseTitle,
    formattedStartDate,
    whatsappLink,
    phone,
    country,
    amount,
    currency,
    orderId,
  } = params;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>¡Inscripción Exitosa - Ferreira Academy!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #050505;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #E5E7EB;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #050505;
      padding-bottom: 40px;
    }
    .main-container {
      background-color: #0b0b0b;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border: 1px solid #2a2415;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.15);
    }
    .gold-button {
      background: #D4AF37;
      background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7C11 100%);
      color: #000000 !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 1px;
      padding: 16px 32px;
      border-radius: 8px;
      display: inline-block;
      text-transform: uppercase;
      text-align: center;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.35);
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <center class="wrapper" style="width: 100%; table-layout: fixed; background-color: #050505; padding-top: 30px; padding-bottom: 40px;">
    <div style="max-width: 600px; margin: 0 auto;">
      <table class="main-container" align="center" style="border-spacing: 0; color: #E5E7EB; margin: 0 auto; width: 100%; max-width: 600px; background-color: #0b0b0b; border: 1px solid #2a2415; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.15);">
        
        <!-- BARRA DORADA SUPERIOR -->
        <tr>
          <td height="4" style="background: linear-gradient(90deg, #8C6D23 0%, #F5E08E 50%, #8C6D23 100%); font-size: 0; line-height: 0;">&nbsp;</td>
        </tr>

        <!-- HEADER / LOGOTIPO OFICIAL -->
        <tr>
          <td align="center" style="padding: 36px 20px 20px 20px; background: radial-gradient(circle at center, #1a160d 0%, #0b0b0b 70%);">
            <div style="text-align: center; margin-bottom: 10px;">
              <span style="font-size: 34px; font-weight: 900; letter-spacing: 4px; color: #D4AF37; font-family: 'Georgia', serif; text-shadow: 0 0 18px rgba(212,175,55,0.5);">FA</span>
            </div>
            <div style="font-family: 'Georgia', serif; font-size: 22px; font-weight: bold; letter-spacing: 5px; color: #FFFFFF; text-transform: uppercase;">
              FERREIRA
            </div>
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 6px; color: #D4AF37; text-transform: uppercase; margin-top: 4px;">
              ACADEMY
            </div>
            <div style="font-size: 10px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin-top: 6px;">
              International Barber Education
            </div>
          </td>
        </tr>

        <!-- LÍNEA SEPARADORA -->
        <tr>
          <td style="padding: 0 40px;">
            <div style="height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); opacity: 0.35;"></div>
          </td>
        </tr>

        <!-- CUERPO PRINCIPAL -->
        <tr>
          <td style="padding: 32px 36px 20px 36px;">
            
            <!-- BADGE DE ÉXITO -->
            <table align="center" style="margin: 0 auto 20px auto;">
              <tr>
                <td style="background-color: rgba(37, 211, 102, 0.12); border: 1px solid rgba(37, 211, 102, 0.4); border-radius: 20px; padding: 6px 18px; text-align: center;">
                  <span style="color: #25D366; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                    ✓ Pago Confirmado & Inscripción Exitosa
                  </span>
                </td>
              </tr>
            </table>

            <!-- SALUDO PERSONALIZADO -->
            <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; text-align: center; margin: 0 0 12px 0; font-family: 'Georgia', serif;">
              ¡Bienvenido/a a la Élite, <span style="color: #D4AF37;">${participantName}</span>!
            </h1>

            <p style="color: #D1D5DB; font-size: 14px; line-height: 1.6; text-align: center; margin: 0 0 24px 0;">
              Tu inscripción en <strong>Ferreira Academy</strong> se ha completado con éxito. Has dado un paso fundamental hacia el dominio técnico de nivel internacional. A continuación tienes los detalles de tu confirmación:
            </p>

            <!-- CAJA DE RESUMEN DE LA INSCRIPCIÓN -->
            <table width="100%" style="background-color: #121212; border: 1px solid #2a2415; border-radius: 12px; margin-bottom: 28px; overflow: hidden;">
              <tr>
                <td style="padding: 20px;">
                  
                  <table width="100%" style="margin-bottom: 12px;">
                    <tr>
                      <td style="font-size: 11px; font-weight: bold; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">
                        Nombre del Participante:
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 16px; font-weight: bold; color: #FFFFFF;">
                        ${participantName}
                      </td>
                    </tr>
                  </table>

                  <div style="height: 1px; background-color: #222222; margin-bottom: 12px;"></div>

                  <table width="100%" style="margin-bottom: 12px;">
                    <tr>
                      <td style="font-size: 11px; font-weight: bold; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">
                        Curso Inscrito:
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 15px; font-weight: bold; color: #F5E08E;">
                        ${courseTitle}
                      </td>
                    </tr>
                  </table>

                  <div style="height: 1px; background-color: #222222; margin-bottom: 12px;"></div>

                  <table width="100%" style="margin-bottom: 12px;">
                    <tr>
                      <td style="font-size: 11px; font-weight: bold; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">
                        Fecha de Inicio:
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 14px; font-weight: 600; color: #E5E7EB;">
                        📅 ${formattedStartDate}
                      </td>
                    </tr>
                  </table>

                  ${amount ? `
                  <div style="height: 1px; background-color: #222222; margin-bottom: 12px;"></div>
                  <table width="100%">
                    <tr>
                      <td style="font-size: 11px; font-weight: bold; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">
                        Monto Cancelado:
                      </td>
                      <td align="right" style="font-size: 11px; font-weight: bold; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">
                        Estado:
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 14px; font-weight: bold; color: #D4AF37;">
                        $${typeof amount === 'number' ? amount.toFixed(2) : amount} ${currency || 'USD'}
                      </td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #25D366;">
                        Completado ✓
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                </td>
              </tr>
            </table>

            <!-- SECCIÓN COMUNIDAD VIP DE WHATSAPP -->
            <table width="100%" style="background: linear-gradient(180deg, #16140e 0%, #0d0c08 100%); border: 1px solid #4a3e1a; border-radius: 12px; padding: 24px 20px; margin-bottom: 24px; text-align: center;">
              <tr>
                <td align="center">
                  <div style="font-size: 28px; margin-bottom: 8px;">📲</div>
                  <h2 style="color: #F5E08E; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-family: 'Georgia', serif;">
                    Comunidad VIP Exclusiva de WhatsApp
                  </h2>
                  <p style="color: #D1D5DB; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0; max-width: 440px;">
                    Haz clic en el botón a continuación para unirte de inmediato a nuestra comunidad privada de WhatsApp. Por allí compartiremos los accesos oficiales, dirección/enlace y material complementario.
                  </p>
                  
                  <!-- BOTÓN CTA DORADO -->
                  <div>
                    <a href="${whatsappLink}" target="_blank" style="background: #D4AF37; background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7C11 100%); color: #000000; text-decoration: none; font-weight: 900; font-size: 13px; letter-spacing: 1.5px; padding: 15px 28px; border-radius: 8px; display: inline-block; text-transform: uppercase; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);">
                      UNIRSE AL GRUPO VIP DE WHATSAPP &rarr;
                    </a>
                  </div>

                  <p style="color: #9CA3AF; font-size: 11px; margin: 14px 0 0 0;">
                    Enlace directo: <a href="${whatsappLink}" style="color: #D4AF37; word-break: break-all;">${whatsappLink}</a>
                  </p>
                </td>
              </tr>
            </table>

            <!-- INSTRUCCIONES ADICIONALES -->
            <table width="100%" style="margin-bottom: 20px;">
              <tr>
                <td style="color: #9CA3AF; font-size: 12px; line-height: 1.6; text-align: left; padding: 0 10px;">
                  <strong style="color: #D4AF37;">Nota:</strong> Conserva este correo como comprobante oficial de tu reserva. Si requieres asistencia personalizada, puedes escribirnos a <a href="mailto:${ACADEMY_EMAIL}" style="color: #D4AF37;">${ACADEMY_EMAIL}</a>.
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- LÍNEA SEPARADORA FOOTER -->
        <tr>
          <td style="padding: 0 36px;">
            <div style="height: 1px; background-color: #222222;"></div>
          </td>
        </tr>

        <!-- FOOTER CORPORATIVO -->
        <tr>
          <td style="padding: 24px 36px 30px 36px; background-color: #070707; text-align: center;">
            <p style="color: #D4AF37; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 6px 0;">
              FERREIRA ACADEMY
            </p>
            <p style="color: #6B7280; font-size: 11px; margin: 0 0 12px 0;">
              Excelencia, Lujo y Maestría en Educación de Barbería Internacional
            </p>
            <p style="color: #4B5563; font-size: 10px; margin: 0;">
              © 2026 Ferreira Academy. Todos los derechos reservados.
            </p>
          </td>
        </tr>

      </table>
    </div>
  </center>
</body>
</html>
  `.trim();
}

/**
 * Envía la notificación de registro exitoso y confirmación de pago
 * a través de la API oficial de Web3Forms (https://api.web3forms.com/submit).
 * Funciona tanto desde el lado del cliente (Client-Side) como del servidor.
 */
export async function sendRegistrationEmail(
  params: SendRegistrationEmailParams
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
      process.env.WEB3FORMS_ACCESS_KEY ||
      WEB3FORMS_ACCESS_KEY;

    const participantName = (params.certificateName || '').trim() || 'Participante';
    const recipientEmail = (params.email || '').trim();
    const courseTitle = (params.courseName || '').trim() || currentCourse.title;
    const formattedStartDate =
      params.startDate || getFormattedCourseDate('es', currentCourse.startDate);

    if (!recipientEmail) {
      console.warn('[Web3Forms] Omitiendo envío: No se proveyó un email válido.');
      return { success: false, error: 'Email faltante o inválido' };
    }

    const htmlBody = generateRegistrationEmailHtml({
      participantName,
      courseTitle,
      formattedStartDate,
      whatsappLink: WHATSAPP_VIP_URL,
      phone: params.phone,
      country: params.country,
      amount: params.amount,
      currency: params.currency,
      orderId: params.orderId,
    });

    const payload = {
      access_key: accessKey,
      name: participantName,
      email: recipientEmail,
      subject: '¡Inscripción Exitosa - Ferreira Academy!',
      from_name: 'Ferreira Academy',
      replyto: ACADEMY_EMAIL,
      message: htmlBody,
      // Metadatos estructurados para el dashboard de Web3Forms
      curso: courseTitle,
      participante: participantName,
      email_participante: recipientEmail,
      telefono: params.phone || 'No especificado',
      pais: params.country || 'No especificado',
      monto: params.amount ? `${params.amount} ${params.currency || 'USD'}` : 'N/A',
      metodo_pago: params.paymentMethod || 'paypal',
      paypal_order_id: params.orderId || 'N/A',
      comunidad_vip_whatsapp: WHATSAPP_VIP_URL,
      fecha_inicio: formattedStartDate,
    };

    console.log(`[Web3Forms] Enviando correo de confirmación a: ${recipientEmail} (${participantName})...`);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json().catch(() => ({}));

    if (response.ok && responseData.success !== false) {
      console.log(`[Web3Forms] ✅ Correo de confirmación enviado exitosamente a: ${recipientEmail}`);
      return { success: true, data: responseData };
    } else {
      console.error('[Web3Forms] ❌ Error en respuesta de Web3Forms:', responseData);
      return {
        success: false,
        error: responseData?.message || `HTTP ${response.status}`,
      };
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Web3Forms] ❌ Excepción al enviar correo con Web3Forms:', err?.message || err);
    return {
      success: false,
      error: err?.message || 'Error desconocido al conectar con Web3Forms',
    };
  }
}
