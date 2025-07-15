import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Find users not already liked/disliked by current user
  const likedUserIds = await prisma.userLike.findMany({
    where: { fromUserId: currentUser.id },
    select: { toUserId: true },
  });
  const excludedIds = [currentUser.id, ...likedUserIds.map((l: { toUserId: string }) => l.toUserId)];

  const potentialMatches = await prisma.user.findMany({
    where: {
      onboarded: true,
      id: { notIn: excludedIds },
    },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      age: true,
      gender: true,
      location: true,
    },
    take: 20,
  });

  return NextResponse.json(potentialMatches);
} 