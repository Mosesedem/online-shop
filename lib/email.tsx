import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendPasswordEmail(email: string, password: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your Store Account Password",
    html: `
      <h2>Welcome to Our Store!</h2>
      <p>Your account has been created. Here's your temporary password:</p>
      <p style="font-size: 18px; font-weight: bold; padding: 10px; background: #f0f0f0;">
        ${password}
      </p>
      <p>Please log in and change this password in your profile settings.</p>
    `,
  })
}
