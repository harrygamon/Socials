'use client'
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.replace('/feed');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-xl w-full text-center space-y-8 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-jelly-600 drop-shadow mb-4">Welcome to Social</h1>
        <p className="text-lg sm:text-xl text-secondary-700 dark:text-secondary-200 mb-6">
          Meet new people, share your moments, and connect in real time.<br />
          <span className="font-semibold text-primary-500">Swipe. Match. Chat. Discover.</span>
        </p>
        <div className="flex flex-col gap-4 items-center">
          <ul className="text-left mx-auto space-y-2 text-base sm:text-lg text-secondary-700 dark:text-secondary-200">
            <li>✅ Google sign-in, secure and fast</li>
            <li>✅ Real-time feed, likes, and comments</li>
            <li>✅ Beautiful, responsive design</li>
            <li>✅ Cloud image uploads</li>
            <li>✅ Discover and connect with new people</li>
          </ul>
        </div>
        <button
          onClick={() => signIn('google')}
          className="mt-8 w-full sm:w-auto px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.74 0 24 0 14.82 0 6.71 5.1 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.03l7.18 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.02-2.98-1.02-6.18 0-9.16l-7.98-6.2C.9 17.1 0 20.44 0 24c0 3.56.9 6.9 2.69 10.71l7.98-6.06z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.18-5.59c-2.01 1.35-4.6 2.15-8.71 2.15-6.38 0-11.87-3.63-14.33-8.86l-7.98 6.06C6.71 42.9 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Sign in with Google
        </button>
      </div>
    </main>
  );
} 