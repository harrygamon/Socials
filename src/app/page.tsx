import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from '@/components/navbar'
import Feed from '@/components/Feed'
import StoriesBar from '@/components/StoriesBar'
import MatchCard from '@/components/MatchCard'
import Trending from '@/components/Trending'
import PostForm from '@/components/PostForm'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/welcome");
  }
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Top Navbar */}
      <Navbar />
      <div className="flex pt-16 max-w-7xl mx-auto w-full">
        {/* Left Sidebar: Suggested Matches */}
        <aside className="hidden xl:block xl:w-72 pr-4">
          <div className="sticky top-20 space-y-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">Suggested Matches</h2>
            {[1,2,3].map((id) => (
              <MatchCard key={id} />
            ))}
            <div className="mt-8">
              <Link href="/pricing" className="btn-primary block text-center">See Subscription Plans</Link>
            </div>
          </div>
        </aside>
        {/* Main Feed */}
        <main className="flex-1 max-w-2xl mx-auto px-2 sm:px-4">
          <div className="space-y-6">
            <PostForm />
            <StoriesBar />
            <Feed />
          </div>
        </main>
        {/* Right Sidebar: Trending Tags */}
        <aside className="hidden xl:block xl:w-72 pl-4">
          <div className="sticky top-20">
            <Trending />
          </div>
        </aside>
      </div>
    </div>
  )
} 