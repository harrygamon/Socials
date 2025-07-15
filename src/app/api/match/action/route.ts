import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
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

  const { toUserId, liked } = await req.json();
  if (!toUserId || typeof liked !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (toUserId === currentUser.id) {
    return NextResponse.json({ error: 'Cannot like/dislike yourself' }, { status: 400 });
  }

  // Create or update the UserLike
  await prisma.userLike.upsert({
    where: { fromUserId_toUserId: { fromUserId: currentUser.id, toUserId } },
    update: { liked },
    create: { fromUserId: currentUser.id, toUserId, liked },
  });

  // If liked, check for mutual like
  let isMatch = false;
  if (liked) {
    const reciprocal = await prisma.userLike.findUnique({
      where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: currentUser.id } },
      select: { liked: true },
    });
    if (reciprocal?.liked) {
      // Create a Match if not already exists
      const existingMatch = await prisma.match.findFirst({
        where: {
          OR: [
            { userAId: currentUser.id, userBId: toUserId },
            { userAId: toUserId, userBId: currentUser.id },
          ],
        },
      });
      if (!existingMatch) {
        await prisma.match.create({
          data: { userAId: currentUser.id, userBId: toUserId },
        });
      }
      isMatch = true;
    }
  }

  return NextResponse.json({ success: true, isMatch });
} 