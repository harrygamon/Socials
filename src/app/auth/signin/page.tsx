'use client'
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  if (session?.user) {
    router.replace('/')
    return null
  }

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    await signIn('github', { callbackUrl: '/' })
    setIsLoading(false)
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await signIn('email', { email, redirect: false })
    setIsLoading(false)
    if (!result?.error) setIsEmailSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-secondary-800 rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary-600 dark:text-primary-400">Sign in to Social</h1>
        {!isEmailSent ? (
          <>
            <button
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="w-full mb-4 py-2 bg-secondary-900 hover:bg-secondary-800 text-white rounded-lg font-medium"
            >
              Continue with GitHub
            </button>
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500"
              />
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
              >
                {isLoading ? 'Sending...' : 'Continue with Email'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">📧</span>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Check your email
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <button
              onClick={() => setIsEmailSent(false)}
              className="w-full py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white rounded-lg font-medium mt-4"
            >
              Try a different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 