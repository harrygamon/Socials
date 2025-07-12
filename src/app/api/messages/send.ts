import { NextRequest, NextResponse } from 'next/server';
import { pusher } from '@/lib/pusher';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const schema = z.object({
    conversationId: z.string().min(1),
    content: z.string().min(1).max(2000),
  });
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
  }
  const { conversationId, content } = result.data;

  // Save message to DB
  const message = await prisma.message.create({
    data: {
      content,
      conversationId,
      senderId: session.user.id,
    },
    include: { sender: true },
  });

  // Trigger Pusher event
  await pusher.trigger(`conversation-${conversationId}`, 'new-message', {
    id: message.id,
    content: message.content,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      image: message.sender.image,
    },
    createdAt: message.createdAt,
  });

  return NextResponse.json({ message });
} 