import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, getPasswordResetEmailHtml } from '@/lib/utils';
import crypto from 'crypto';

const RESET_TOKEN_EXPIRY_HOURS = 2;

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // For security, do not reveal if the email exists
    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
  }

  // Generate a secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Store the token in the database
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  // Construct the reset link
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

  // Send the reset email with modern template
  await sendEmail({
    to: email,
    subject: 'Reset your password',
    html: getPasswordResetEmailHtml({ resetLink, hours: RESET_TOKEN_EXPIRY_HOURS }),
  });

  return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
} 