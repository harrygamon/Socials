"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/auth/signin"), 1500)
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-secondary-800 rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary-600 dark:text-primary-400">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Account created! Redirecting...</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-secondary-600 dark:text-secondary-400">
          Already have an account? <a href="/auth/signin" className="text-primary-600 dark:text-primary-400 underline">Sign In</a>
        </div>
      </div>
    </div>
  )
} 