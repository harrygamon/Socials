"use client";
import { useSession } from "next-auth/react";
 
export function SubscriptionStatus() {
  const { data: session } = useSession();
  const plan = session?.user?.subscription || "FREE";
  return <div>Your current plan: <b>{plan}</b></div>;
} 