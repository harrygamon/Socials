import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const date = searchParams.get('date');
    const contentType = searchParams.get('contentType');
    const now = new Date();
    let dateFrom: Date | undefined;
    if (date === 'recent') dateFrom = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    else if (date === 'week') dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (date === 'month') dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const where: Prisma.PostWhereInput = {};
    if (dateFrom) where.createdAt = { gte: dateFrom };
    if (contentType === 'text') where.mediaUrls = { equals: [] };
    if (contentType === 'image') where.mediaUrls = { not: { equals: [] } };
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      take: 20,
    });
    // Aggregate engagement with real counts
    const postsWithEngagement = await Promise.all(posts.map(async post => {
      const likesCount = await prisma.like.count({
        where: {
          postId: post.id,
          ...(dateFrom ? { createdAt: { gte: dateFrom } } : {}),
        },
      });
      const commentsCount = await prisma.comment.count({
        where: {
          postId: post.id,
          ...(dateFrom ? { createdAt: { gte: dateFrom } } : {}),
        },
      });
      return {
        ...post,
        likes: likesCount,
        commentsCount,
      };
    }));
    // Sort by (likes + comments) descending
    postsWithEngagement.sort((a, b) => (b.likes + b.commentsCount) - (a.likes + a.commentsCount));
    // Return top 10
    return NextResponse.json({ posts: postsWithEngagement.slice(0, 10) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 