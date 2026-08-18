import { Resend } from 'resend';
import { Language } from './translations';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface RegistrationEmailParams {
  certificateName: string;
  email: string;
  courseName: string;
  country: string;
  lang?: Language;
}

export async function sendCourseRegistrationEmail({
  certificateName,
  email,
  courseName,
  country,
  lang = 'es',
}: RegistrationEmailParams) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY no configurado. Se omite el envío de correo.');
    return;
  }

  const isEs = lang === 'es';

  const subject = isEs 
    ? `¡Inscripción exitosa: ${courseName}!`
    : `Successful Registration: ${courseName}!`;

  const htmlContent = isEs ? `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 30px; border-radius: 8px;">
      <h2 style="color: #d4af37; text-align: center;">¡Inscripción Exitosa!</h2>
      <p>Hola <strong>${certificateName}</strong>,</p>
      <p>Te has inscrito correctamente al curso:</p>
      <div style="background: #1a1a1a; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #d4af37;">${courseName}</p>
      </div>
      <p>Pronto nos pondremos en contacto contigo para darte acceso a la comunidad VIP de WhatsApp y los detalles del inicio.</p>
      <p style="margin-top: 30px; font-size: 14px; color: #888;">Ferreira Academy</p>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 30px; border-radius: 8px;">
      <h2 style="color: #d4af37; text-align: center;">Registration Successful!</h2>
      <p>Hello <strong>${certificateName}</strong>,</p>
      <p>You have successfully registered for the course:</p>
      <div style="background: #1a1a1a; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #d4af37;">${courseName}</p>
      </div>
      <p>We will contact you shortly with details to access the VIP WhatsApp community and start your classes.</p>
      <p style="margin-top: 30px; font-size: 14px; color: #888;">Ferreira Academy</p>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: 'Ferreira Academy <onboarding@resend.dev>', // Cámbialo por tu correo verificado cuando lo tengas listo
      to: [email],
      subject,
      html: htmlContent,
    });

    console.log('[Resend] Correo enviado con éxito:', data);
    return data;
  } catch (error) {
    console.error('[Resend] Error al enviar el correo:', error);
    throw error;
  }
}