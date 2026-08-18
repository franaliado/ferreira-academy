import { Resend } from 'resend';
import { Language, translations } from '@/lib/translations';
import { currentCourse, getFormattedCourseDate } from '@/data/currentCourse';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendRegistrationEmailProps {
  certificateName: string;
  email: string;
  courseName?: string;
  country?: string;
  lang?: Language;
  whatsappLink?: string;
}

export async function sendCourseRegistrationEmail({
  certificateName,
  email,
  courseName,
  country,
  lang = 'es',
  whatsappLink = 'https://chat.whatsapp.com/DYZZgiY5rm4Imls1wGIZzy?s=cl&p=a&ilr=1',
}: SendRegistrationEmailProps) {
  try {
    const selectedLang: Language = translations[lang] ? lang : 'es';
    const tEmail = (translations[selectedLang] || translations.es).emailTemplates;
    const courseTitle = courseName || currentCourse.title;

    const formattedDate = getFormattedCourseDate(selectedLang, currentCourse.startDate);
    const modalityText = currentCourse.isPresencial
      ? tEmail.inPersonModality
      : tEmail.zoomModality;

    const subject = tEmail.subject.replace('{courseName}', courseTitle);
    const greetingName =
      certificateName && certificateName.trim()
        ? certificateName.trim()
        : (translations[selectedLang]?.enrollmentModal?.defaultParticipant || 'Participante');
    const greeting = tEmail.greeting.replace('{name}', greetingName);
    const mainText = tEmail.mainText.replace('{courseName}', courseTitle);

    const baseUrlApp = process.env.NEXT_PUBLIC_SITE_URL || 'https://ferreira-academy.vercel.app';
    const logoUrl = `${baseUrlApp}/Logo_Oficial_Negro.png`;

    const html = `
      <div style="font-family: 'Montserrat', Arial, sans-serif; background-color: #000000; color: #ffffff; padding: 40px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 8px; padding: 30px;">
          
          <!-- Logo Oficial en Negro -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${logoUrl}" alt="Ferreira Academy" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" />
          </div>

          <!-- Saludo y Mensaje Principal -->
          <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 20px;">${greeting}</h2>
          <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            ${mainText}
          </p>

          <!-- Detalles del Curso desde currentCourse y getFormattedCourseDate -->
          <div style="background-color: #1a1a1a; border-left: 4px solid #D4AF37; padding: 15px 20px; margin-bottom: 30px; border-radius: 4px;">
            <p style="margin: 6px 0; color: #dddddd; font-size: 14px;">📅 <strong>${tEmail.startDateLabel}</strong> ${formattedDate}</p>
            <p style="margin: 6px 0; color: #dddddd; font-size: 14px;">📍 <strong>${tEmail.modalityLabel}</strong> ${modalityText}</p>
            ${country ? `<p style="margin: 6px 0; color: #dddddd; font-size: 14px;">🌍 <strong>${tEmail.registeredCountryLabel}</strong> ${country}</p>` : ''}
          </div>

          <!-- Botón de WhatsApp -->
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="color: #cccccc; font-size: 14px; margin-bottom: 15px;">${tEmail.whatsappNotice}</p>
            <a href="${whatsappLink}" target="_blank" style="background-color: #25D366; color: #ffffff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 14px;">${tEmail.whatsappButton}</a>
          </div>

          <!-- Pie de página -->
          <hr style="border: none; border-top: 1px solid #333333; margin: 30px 0;" />
          <p style="text-align: center; color: #777777; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ${tEmail.footerRights}
          </p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Ferreira Academy <ferreiraacademy.oficial@gmail.com>',
      to: [email],
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar correo con Resend:', error);
    return { success: false, error };
  }
}