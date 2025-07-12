import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const PRICE_IDS: Record<string, string> = {
  SILVER: process.env.STRIPE_SILVER_PRICE_ID!,
  GOLD: process.env.STRIPE_GOLD_PRICE_ID!,
}

export async function POST(req: NextRequest) {
  const userSession = await getServerSession(authOptions);
  if (!userSession || !userSession.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const schema = z.object({ plan: z.enum(['SILVER', 'GOLD']) });
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid plan', details: result.error.issues }, { status: 400 });
  }
  const { plan } = result.data;
  if (!PRICE_IDS[plan]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: PRICE_IDS[plan],
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?canceled=1`,
  });

  return NextResponse.json({ url: stripeSession.url });
} 