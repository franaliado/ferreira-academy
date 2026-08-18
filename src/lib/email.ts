import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "live.smtp.mailtrap.io",
    port: Number(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_USER || "api",
      pass: process.env.SMTP_PASS || "0f515938e42f323e92f900fb01f188ac"
    }
  });

  try {
    const info = await transporter.sendMail({
      // Usamos el dominio genérico permitido por Mailtrap para evitar el bloqueo de dominio
      from: '"Ferreira Academy" <no-reply@demomailtrap.co>',
      to,
      subject,
      html,
    });
    
    console.log("Correo enviado con éxito. MessageId: %s", info.messageId);
    return info;
  } catch (error: any) {
    console.error("ERROR DETALLADO DE NODEMAILER:", {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    throw error;
  }
}