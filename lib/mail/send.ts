import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 587,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(to: string, code: string) {
  await transporter.sendMail({
    from: '"Union" <union.auth@gmail.com>',
    to,
    subject: "[Union] 이메일 인증 코드",
    html: `
      <div style="max-width:400px;margin:0 auto;padding:32px;font-family:sans-serif;text-align:center;">
        <h2 style="margin-bottom:8px;">이메일 인증</h2>
        <p style="color:#666;margin-bottom:24px;">아래 인증 코드를 입력해주세요.</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:16px;background:#f4f4f5;border-radius:8px;">
          ${code}
        </div>
        <p style="color:#999;margin-top:24px;font-size:13px;">이 코드는 5분간 유효합니다.</p>
      </div>
    `,
  });
}
