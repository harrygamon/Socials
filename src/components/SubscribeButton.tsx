"use client";
import { useState } from "react";

export function SubscribeButton({ plan }: { plan: "SILVER" | "GOLD" }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong!");
    }
  };

  return (
    <button onClick={handleSubscribe} disabled={loading}>
      {loading ? "Redirecting..." : `Subscribe to ${plan}`}
    </button>
  );
} 