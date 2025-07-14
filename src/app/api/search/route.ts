import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Prisma, Gender } from '@prisma/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const query = searchParams.get('query')?.trim() || '';
  const type = searchParams.get('type') || 'user';
  if (!query) {
    return NextResponse.json({ results: [] });
  }
  try {
    if (type === 'user') {
      // Filters
      const gender = searchParams.get('gender') || undefined;
      const location = searchParams.get('location') || undefined;
      const ageMin = searchParams.get('ageMin') ? parseInt(searchParams.get('ageMin')!) : undefined;
      const ageMax = searchParams.get('ageMax') ? parseInt(searchParams.get('ageMax')!) : undefined;
      const where: Prisma.UserWhereInput = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
        ],
      };
      if (gender) where.gender = gender as Gender;
      if (location) where.location = { contains: location, mode: 'insensitive' };
      if (ageMin !== undefined || ageMax !== undefined) {
        where.AND = [];
        if (ageMin !== undefined) where.AND.push({ age: { gte: ageMin } });
        if (ageMax !== undefined) where.AND.push({ age: { lte: ageMax } });
      }
      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
        take: 20,
      });
      return NextResponse.json({ results: users });
    } else if (type === 'post') {
      // Filters
      const date = searchParams.get('date');
      const contentType = searchParams.get('contentType');
      const now = new Date();
      let dateFrom: Date | undefined;
      if (date === 'recent') dateFrom = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      else if (date === 'week') dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else if (date === 'month') dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const where: Prisma.PostWhereInput = {
        content: { contains: query, mode: 'insensitive' },
      };
      if (dateFrom) where.createdAt = { gte: dateFrom };
      const posts = await prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      let filteredPosts = posts;
      if (contentType === 'text') {
        filteredPosts = posts.filter(post => post.mediaUrls.length === 0);
      } else if (contentType === 'image') {
        filteredPosts = posts.filter(post => post.mediaUrls.length > 0);
      }
      return NextResponse.json({ results: filteredPosts });
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 