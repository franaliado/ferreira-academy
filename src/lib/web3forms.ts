import { currentCourse, getFormattedCourseDate } from '@/data/currentCourse';

export const WHATSAPP_VIP_URL =
  'https://chat.whatsapp.com/DYZZgiY5rm4Imls1wGIZzy?s=cl&p=a&ilr=1';

export const WEB3FORMS_ACCESS_KEY =
  'e6f63289-2871-492d-810f-b2acb4b0e54e';

export const ACADEMY_EMAIL =
  'ferreiraacademy.oficial@gmail.com';

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
 * Genera un texto estructurado optimizado para que Web3Forms lo procese
 * correctamente sin rechazar la petición por exceso de código HTML.
 */
function generateRegistrationEmailBody(params: {
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
¡INSCRIPCIÓN EXITOSA - FERREIRA ACADEMY!

Hola ${participantName},
Tu inscripción en Ferreira Academy se ha completado con éxito. Has dado un paso fundamental hacia el dominio técnico de nivel internacional.

DETALLES DE LA INSCRIPCIÓN:
- Participante: ${participantName}
- Curso: ${courseTitle}
- Fecha de Inicio: ${formattedStartDate}
- Monto Cancelado: ${amount !== undefined && amount !== null && amount !== '' ? `$${typeof amount === 'number' ? amount.toFixed(2) : amount} ${currency || 'USD'}` : 'N/A'} (Completado)
- ID de Orden: ${orderId || 'N/A'}
- Teléfono: ${phone || 'No especificado'}
- País: ${country || 'No especificado'}

COMUNIDAD VIP EXCLUSIVA DE WHATSAPP:
Únete de inmediato a nuestra comunidad privada de WhatsApp para recibir accesos y material complementario:
${whatsappLink}

Si requieres asistencia personalizada, puedes escribirnos a ${ACADEMY_EMAIL}.

© 2026 Ferreira Academy. Todos los derechos reservados.
  `.trim();
}

/**
 * Envía la confirmación de inscripción mediante Web3Forms.
 */
export async function sendRegistrationEmail(
  params: SendRegistrationEmailParams
): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
      WEB3FORMS_ACCESS_KEY;

    const participantName =
      (params.certificateName || '').trim() || 'Participante';

    const recipientEmail =
      (params.email || '').trim().toLowerCase();

    const courseTitle =
      (params.courseName || '').trim() ||
      currentCourse.title;

    const formattedStartDate =
      params.startDate ||
      getFormattedCourseDate(
        'es',
        currentCourse.startDate
      );

    if (!recipientEmail) {
      console.warn(
        '[Web3Forms] Omitiendo envío: no se proporcionó un email válido.'
      );

      return {
        success: false,
        error: 'Email faltante o inválido',
      };
    }

    if (!accessKey) {
      console.error(
        '[Web3Forms] No existe una Access Key configurada.'
      );

      return {
        success: false,
        error: 'Web3Forms Access Key no configurada',
      };
    }

    const textBody =
      generateRegistrationEmailBody({
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
      replyto: recipientEmail,
      message: textBody,
      curso: courseTitle,
      participante: participantName,
      email_participante: recipientEmail,
      telefono: params.phone || 'No especificado',
      pais: params.country || 'No especificado',
      monto:
        params.amount !== undefined &&
        params.amount !== null &&
        params.amount !== ''
          ? `${params.amount} ${params.currency || 'USD'}`
          : 'N/A',
      metodo_pago: params.paymentMethod || 'paypal',
      paypal_order_id: params.orderId || 'N/A',
      comunidad_vip_whatsapp: WHATSAPP_VIP_URL,
      fecha_inicio: formattedStartDate,
    };

    console.log(
      `[Web3Forms] Enviando confirmación para: ${recipientEmail} (${participantName})`
    );

    const response = await fetch(
      'https://api.web3forms.com/submit',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();
    let responseData: any = {};

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseData = { rawResponse: responseText };
    }

    console.log('[Web3Forms] Respuesta HTTP:', response.status);
    console.log('[Web3Forms] Respuesta API:', responseData);

    if (
      response.ok &&
      responseData &&
      responseData.success === true
    ) {
      console.log(
        `[Web3Forms] ✅ Formulario enviado correctamente para: ${recipientEmail}`
      );

      return {
        success: true,
        data: responseData,
      };
    }

    const apiError =
      responseData?.message ||
      responseData?.error ||
      `Web3Forms respondió con HTTP ${response.status}`;

    console.error(
      '[Web3Forms] ❌ Web3Forms rechazó la solicitud:',
      apiError
    );

    return {
      success: false,
      error: apiError,
      data: responseData,
    };

  } catch (error: unknown) {
    const err =
      error instanceof Error
        ? error
        : new Error('Error desconocido al conectar con Web3Forms');

    console.error('[Web3Forms] ❌ Excepción:', err.message);

    return {
      success: false,
      error: err.message,
    };
  }
}