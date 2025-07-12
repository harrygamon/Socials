type Post = {
  author: {
    name: string
    avatar: string
  }
  content: string
  image: string
  likes: number
  comments: number
  createdAt: string
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="post-card bg-white/90 dark:bg-jelly-900/90 rounded-3xl shadow-jelly border border-jelly-100 overflow-hidden transition-all duration-200 hover:scale-[1.015] hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-jelly-200 shadow-jelly"
        />
        <div>
          <div className="font-bold text-jelly-900 text-lg">{post.author.name}</div>
          <div className="text-xs text-jelly-400">{post.createdAt}</div>
        </div>
      </div>
      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-jelly-900 dark:text-white mb-3 whitespace-pre-line text-base font-medium">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post image"
            className="w-full rounded-2xl object-cover max-h-96 mb-2 border border-jelly-100 shadow-jelly"
          />
        )}
        <div className="flex items-center gap-6 mt-2 text-base">
          <span className="text-jelly-500 font-bold flex items-center gap-1">♥ {post.likes}</span>
          <span className="text-jelly-400">💬 {post.comments} comments</span>
        </div>
      </div>
    </div>
  )
}
