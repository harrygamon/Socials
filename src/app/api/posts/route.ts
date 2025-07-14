import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { Session } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, images } = await req.json();
    if (!content || typeof content !== 'string' || content.length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (!Array.isArray(images) || images.some((url) => typeof url !== 'string')) {
      return NextResponse.json({ error: 'Images must be an array of URLs' }, { status: 400 });
    }
    const post = await prisma.post.create({
      data: {
        content,
        mediaUrls: images,
        authorId: session.user.id,
      },
      include: {
        author: true,
      },
    });
    return NextResponse.json({ post });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const take = parseInt(searchParams.get('limit') || '10', 10);
  const cursor = searchParams.get('cursor');

  const orderBy = { createdAt: 'desc' as const };

  let posts;
  if (cursor) {
    posts = await prisma.post.findMany({
      take,
      skip: 1,
      cursor: { id: cursor },
      orderBy,
      include: { author: true },
    });
  } else {
    posts = await prisma.post.findMany({
      take,
      orderBy,
      include: { author: true },
    });
  }

  return NextResponse.json({ posts });
} 