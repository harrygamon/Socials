import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'no-reply@social.com', // Update this to your verified sender domain
      to,
      subject,
      html,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}

export function getPasswordResetEmailHtml({ resetLink, hours }: { resetLink: string; hours: number }) {
  return `
  <div style="font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'sans-serif'; background: #f6f8fa; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 32px 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 2rem; font-weight: bold; color: #2563eb; letter-spacing: 1px;">Social</span>
      </div>
      <h2 style="color: #222; font-size: 1.25rem; margin-bottom: 16px; text-align: center;">Reset your password</h2>
      <p style="color: #444; font-size: 1rem; margin-bottom: 24px; text-align: center;">We received a request to reset your password. Click the button below to set a new password. This link will expire in <b>${hours} hours</b>.</p>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 32px; border-radius: 6px; font-size: 1rem; text-decoration: none; font-weight: 500;">Reset Password</a>
      </div>
      <p style="color: #888; font-size: 0.95rem; text-align: center;">If the button above doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #2563eb; font-size: 0.95rem; text-align: center;">${resetLink}</p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #aaa; font-size: 0.9rem; text-align: center;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  </div>
  `;
} 