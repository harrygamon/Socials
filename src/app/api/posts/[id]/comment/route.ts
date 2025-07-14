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
  const { content } = await req.json();
  if (!content || typeof content !== 'string' || content.length === 0) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
  try {
    const comment = await prisma.comment.create({
      data: { content, userId, postId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
    // Broadcast new comment
    await pusher.trigger(`post-${postId}`, 'new-comment', comment);
    return NextResponse.json({ comment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;
  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 