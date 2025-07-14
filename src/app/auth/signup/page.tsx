"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

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

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (err) {
      setError('Google sign up failed')
      setLoading(false)
    }
  }

  const handleEmailSignUp = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signIn('email', { 
        email, 
        callbackUrl: '/',
        redirect: false 
      })
      setSuccess(true)
      setError('')
    } catch (err) {
      setError('Email sign up failed')
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
          {success && <div className="text-green-600 text-sm">
            {password ? 'Account created! Redirecting...' : 'Check your email for the magic link!'}
          </div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        
        <div className="my-6 flex items-center justify-center">
          <span className="h-px flex-1 bg-secondary-200 dark:bg-secondary-600" />
          <span className="px-4 text-secondary-400 text-sm">or</span>
          <span className="h-px flex-1 bg-secondary-200 dark:bg-secondary-600" />
        </div>
        
        <button
          onClick={handleEmailSignUp}
          disabled={loading || !email}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 mb-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {loading ? 'Sending...' : 'Sign up with Email Link'}
        </button>
        
        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full py-2 bg-white border border-secondary-200 dark:border-secondary-600 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-secondary-50 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.74 0 24 0 14.82 0 6.71 5.1 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.03l7.18 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.02-2.98-1.02-6.18 0-9.16l-7.98-6.2C.9 17.1 0 20.44 0 24c0 3.56.9 6.9 2.69 10.71l7.98-6.06z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.18-5.59c-2.01 1.35-4.6 2.15-8.71 2.15-6.38 0-11.87-3.63-14.33-8.86l-7.98 6.06C6.71 42.9 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          {loading ? 'Signing up...' : 'Sign up with Google'}
        </button>
        
        <div className="text-center mt-4 text-sm text-secondary-600 dark:text-secondary-400">
          Already have an account? <a href="/auth/signin" className="text-primary-600 dark:text-primary-400 underline">Sign In</a>
        </div>
      </div>
    </div>
  )
} 