"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("If your email is registered, a reset link has been sent.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-900/80 to-pink-700/60 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/30 rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border border-pink-400/30"
        style={{ fontFamily: 'Rubik, sans-serif' }}
      >
        <h1 className="text-2xl font-bold text-center text-pink-500 mb-2">Forgot Password</h1>
        <p className="text-center text-sm text-gray-400 mb-4">Enter your email to receive a password reset link.</p>
        <input
          type="email"
          className="rounded-lg px-4 py-2 bg-white/30 dark:bg-gray-800/40 border border-pink-300/30 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 dark:text-white placeholder:text-gray-400"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {success && <p className="text-green-500 text-center mt-2">{success}</p>}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <a href="/auth/signin" className="text-pink-400 hover:underline text-center text-sm mt-2">Back to sign in</a>
      </form>
    </div>
  );
} 