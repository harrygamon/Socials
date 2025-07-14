import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { pusher } from '@/lib/pusher';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const postId = params.id;
  const userId = session.user.id;
  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }
  try {
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    let liked;
    if (existing) {
      // Unlike
      await prisma.like.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      // Like
      await prisma.like.create({ data: { userId, postId } });
      liked = true;
    }
    const likeCount = await prisma.like.count({ where: { postId } });
    // Broadcast like update
    await pusher.trigger(`post-${postId}`, 'like-updated', { postId, likeCount });
    return NextResponse.json({ liked, likeCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 