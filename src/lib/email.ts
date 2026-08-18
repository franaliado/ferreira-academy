import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "api",
      pass: "0f515938e42f323e92f900fb01f188ac"
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Ferreira Academy" <no-reply@demomailtrap.co>',
      to,
      subject,
      html,
    });
    console.log("Correo enviado con Mailtrap SMTP: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar con Mailtrap SMTP:", error);
    throw error;
  }
}