import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "send.smtp.mailtrap.io",
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || ""
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Ferreira Academy" <ferreiraacademy.oficial@gmail.com>',
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