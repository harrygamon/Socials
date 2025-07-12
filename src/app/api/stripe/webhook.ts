import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const buf = await req.arrayBuffer()
  let event

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig!, endpointSecret)
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const customerId = session.customer
      const email = session.customer_email
      // Update user with Stripe customer ID
      if (email && customerId) {
        await prisma.user.update({
          where: { email },
          data: { stripeCustomerId: customerId },
        })
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const subscription = event.data.object as any
      const customerId = subscription.customer
      let plan = 'FREE'
      if (subscription.items.data.some((item: any) => item.price.id === process.env.STRIPE_SILVER_PRICE_ID)) {
        plan = 'SILVER'
      } else if (subscription.items.data.some((item: any) => item.price.id === process.env.STRIPE_GOLD_PRICE_ID)) {
        plan = 'GOLD'
      }
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { subscription: plan },
      })
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any
      const customerId = subscription.customer
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { subscription: 'FREE' },
      })
      break
    }
    default:
      // Unhandled event type
      break
  }

  return NextResponse.json({ received: true })
} 