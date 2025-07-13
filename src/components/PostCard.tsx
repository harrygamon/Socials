'use client'
import Image from 'next/image'
import { useState } from 'react'

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
  const [imageError, setImageError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  return (
    <div className="post-card bg-white/90 dark:bg-jelly-900/90 rounded-3xl shadow-jelly border border-jelly-100 overflow-hidden transition-all duration-200 hover:scale-[1.015] hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {avatarError ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg border-2 border-jelly-200 shadow-jelly">
            {post.author.name.charAt(0)}
          </div>
        ) : (
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-jelly-200 shadow-jelly"
            width={48}
            height={48}
            onError={() => setAvatarError(true)}
          />
        )}
        <div>
          <div className="font-bold text-jelly-900 text-lg">{post.author.name}</div>
          <div className="text-xs text-jelly-400">{post.createdAt}</div>
        </div>
      </div>
      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-jelly-900 dark:text-white mb-3 whitespace-pre-line text-base font-medium">{post.content}</p>
        {post.image && !imageError && (
          <Image
            src={post.image}
            alt="Post image"
            className="w-full rounded-2xl object-cover max-h-96 mb-2 border border-jelly-100 shadow-jelly"
            width={600}
            height={384}
            onError={() => setImageError(true)}
          />
        )}
        {imageError && (
          <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 flex items-center justify-center mb-2 border border-jelly-100">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-jelly-600 dark:text-jelly-300 text-sm">Image not available</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-6 mt-2 text-base">
          <span className="text-jelly-500 font-bold flex items-center gap-1">♥ {post.likes}</span>
          <span className="text-jelly-400">💬 {post.comments} comments</span>
        </div>
      </div>
    </div>
  )
}
