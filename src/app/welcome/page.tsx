// Trigger redeploy: ensure welcome page is deployed
"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-secondary-800 rounded-xl shadow p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-primary-600 dark:text-primary-400">Welcome to Social</h1>
        <p className="text-lg text-secondary-700 dark:text-secondary-300 mb-8 text-center">
          Connect, discover, and share with people around you. Please log in or sign up to get started!
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full mb-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
        >
          Continue with Google
        </button>
        <button
          onClick={() => router.push("/auth/signin")}
          className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
        >
          Continue with Email
        </button>
      </div>
    </div>
  );
} 