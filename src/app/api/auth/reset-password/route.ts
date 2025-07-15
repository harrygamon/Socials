import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 });
  }

  // Find the reset token
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 400 });
  }

  // Update the user's password
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Mark the token as used
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });

  // Invalidate all other unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: {
      userId: resetToken.userId,
      used: false,
      NOT: { token },
    },
    data: { used: true },
  });

  return NextResponse.json({ message: 'Password reset successful.' });
} 