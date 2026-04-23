import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// 2. Export a generic sendEmail function
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
    });
};

// 3. Export a specific function for sending verification emails
export const sendVerificationEmail = async (toEmail: string, token: string) => {
    const subject = "Verify your email";

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyLink = `${frontendUrl}/verify-email?token=${token}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome! Please verify your email</h2>
      <p>Thank you for registering. Click the link below to verify your email address:</p>
      <a href="${verifyLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

    const text = `Please verify your email by clicking on the link: ${verifyLink}`;

    // Call our generic sendEmail function
    await sendEmail(toEmail, subject, text, html);
};
