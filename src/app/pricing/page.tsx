"use client";

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Free',
    price: '£0',
    features: [
      'Browse profiles',
      'View posts & stories',
      'Basic discover',
    ],
    tier: 'FREE',
    cta: null,
  },
  {
    name: 'Silver',
    price: '£10/mo',
    features: [
      'Swipe on profiles',
      'Send messages',
      'All Free features',
    ],
    tier: 'SILVER',
    cta: 'Subscribe',
  },
  {
    name: 'Gold',
    price: '£20/mo',
    features: [
      'Boosted discover visibility',
      'All Silver features',
    ],
    tier: 'GOLD',
    cta: 'Subscribe',
  },
]

export default function PricingPage() {
  const router = useRouter()

  const handleSubscribe = async (plan: 'SILVER' | 'GOLD') => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50 dark:bg-secondary-900 py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-primary-600 dark:text-primary-400">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {plans.map(plan => (
          <div key={plan.tier} className="card p-8 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2 text-secondary-900 dark:text-white">{plan.name}</h2>
            <div className="text-3xl font-bold mb-4 text-primary-600 dark:text-primary-400">{plan.price}</div>
            <ul className="mb-6 space-y-2 text-secondary-700 dark:text-secondary-300">
              {plan.features.map(f => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            {plan.cta && (
              <Button onClick={() => handleSubscribe(plan.tier as 'SILVER' | 'GOLD')} className="w-full">
                {plan.cta}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 