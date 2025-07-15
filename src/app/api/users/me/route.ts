import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        age: true,
        gender: true,
        location: true,
        createdAt: true,
        posts: { select: { id: true, content: true, mediaUrls: true, createdAt: true } },
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const { image, name, age, gender, bio, interests, location } = data;
  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image,
        name,
        age: age ? Number(age) : undefined,
        gender,
        bio,
        location,
        onboarded: true,
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
} 