import { Stories } from '@/components/stories'
import { CreatePost } from '@/components/create-post'
import Feed from '@/components/Feed'

export default function FeedPage() {
  return (
    <div className="max-w-full sm:max-w-2xl mx-auto space-y-6 p-2 sm:p-4 md:p-6">
      {/* Stories */}
      <Stories />
      {/* Create Post */}
      <CreatePost />
      {/* Posts */}
      <Feed />
    </div>
  )
} 