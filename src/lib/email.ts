import { Resend } from 'resend';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable.');
  }

  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: 'Ferreira Academy <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Correo enviado con éxito por Resend. ID:", data.id);
    return data;
  } catch (error: any) {
    console.error("ERROR DETALLADO DE RESEND:", {
      message: error.message,
      name: error.name,
    });
    throw error;
  }
}