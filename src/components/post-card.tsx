'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Post {
  id: string
  author: {
    id: string
    name: string
    image: string
  }
  content: string
  images: string[]
  likes: number
  comments: number
  createdAt: string
  isLiked: boolean
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showAllImages, setShowAllImages] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleComment = () => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', post.id)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share post:', post.id)
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save post:', post.id)
  }

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.image} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-white">
              {post.author.name}
            </h3>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              {post.createdAt}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        <p className="text-secondary-900 dark:text-white mb-4 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Images */}
      {post.images.length > 0 && (
        <div className="relative">
          {post.images.length === 1 ? (
            <img
              src={post.images[0]}
              alt="Post"
              className="w-full max-h-96 object-cover"
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {post.images.slice(0, showAllImages ? post.images.length : 2).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Post ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  {index === 1 && post.images.length > 2 && !showAllImages && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        +{post.images.length - 2}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {post.images.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
              onClick={() => setShowAllImages(!showAllImages)}
            >
              {showAllImages ? 'Show Less' : 'Show All'}
            </Button>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-secondary-200 dark:border-secondary-700">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-secondary-600 dark:text-secondary-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center space-x-1 text-secondary-600 dark:text-secondary-400"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-1 text-secondary-600 dark:text-secondary-400"
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="text-secondary-600 dark:text-secondary-400"
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        {/* Comments Preview */}
        {post.comments > 0 && (
          <div className="text-sm text-secondary-600 dark:text-secondary-400">
            View all {post.comments} comments
          </div>
        )}
      </div>
    </div>
  )
} 