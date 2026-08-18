import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendRegistrationEmailProps {
  certificateName: string;
  email: string;
  courseName: string;
  courseDate?: string;
  courseLocation?: string;
  whatsappLink?: string;
}

export async function sendCourseRegistrationEmail({
  certificateName,
  email,
  courseName,
  courseDate = 'Próximamente',
  courseLocation = 'Modalidad Online / Presencial',
  whatsappLink = 'https://chat.whatsapp.com/tu-enlace-de-grupo',
}: SendRegistrationEmailProps) {
  try {
    const data = await resend.emails.send({
      from: 'Ferreira Academy <ferreiraacademy.oficial@gmail.com>', 
      to: [email],
      subject: `¡Inscripción exitosa a ${courseName}! - Ferreira Academy`,
      html: `
        <div style="font-family: 'Montserrat', Arial, sans-serif; background-color: #000000; color: #ffffff; padding: 40px; border-radius: 8px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333333; border-radius: 8px; padding: 30px;">
            
            <!-- Logo / Encabezado -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #D4AF37; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Ferreira Academy</h1>
            </div>

            <!-- Saludo y Mensaje Principal -->
            <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 20px;">¡Hola, ${certificateName}!</h2>
            <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Tu inscripción al curso <strong style="color: #D4AF37;">${courseName}</strong> se ha completado con éxito. Estamos encantados de contar contigo en esta experiencia de formación profesional.
            </p>

            <!-- Detalles del Curso -->
            <div style="background-color: #1a1a1a; border-left: 4px solid #D4AF37; padding: 15px 20px; margin-bottom: 30px; border-radius: 4px;">
              <p style="margin: 5px 0; color: #dddddd; font-size: 14px;">📅 <strong>Fecha:</strong> ${courseDate}</p>
              <p style="margin: 5px 0; color: #dddddd; font-size: 14px;">📍 <strong>Ubicación:</strong> ${courseLocation}</p>
            </div>

            <!-- Botón de WhatsApp -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #cccccc; font-size: 14px; margin-bottom: 15px;">Únete a nuestra comunidad exclusiva de WhatsApp para estar al tanto de todos los detalles:</p>
              <a href="${whatsappLink}" target="_blank" style="background-color: #25D366; color: #ffffff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 14px;">Unirme a la Comunidad de WhatsApp</a>
            </div>

            <!-- Pie de página -->
            <hr style="border: none; border-top: 1px solid #333333; margin: 30px 0;" />
            <p style="text-align: center; color: #777777; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Ferreira Academy. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar correo con Resend:', error);
    return { success: false, error };
  }
}