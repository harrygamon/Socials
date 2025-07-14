'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast';

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
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showAllImages, setShowAllImages] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
        toast.success(data.liked ? 'Liked!' : 'Unliked!');
      } else {
        toast.error(data.error || 'Failed to update like');
      }
    } catch (err) {
      toast.error('Failed to update like');
    } finally {
      setLikeLoading(false);
    }
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      window.dispatchEvent(new Event('refresh-feed'));
    } catch (err) {
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Post Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.image} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-white text-base sm:text-lg">
              {post.author.name}
            </h3>
            <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400">
              {post.createdAt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {/* Only show delete button if current user is the author */}
          {((session?.user as { id: string } | null)?.id === post.author.id) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-500 hover:text-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <p className="text-secondary-900 dark:text-white mb-3 sm:mb-4 whitespace-pre-wrap text-sm sm:text-base md:text-lg">
          {post.content}
        </p>
      </div>

      {/* Post Images */}
      {post.images.length > 0 && (
        <div className="relative">
          {post.images.length === 1 ? (
            <Image
              src={post.images[0]}
              alt="Post"
              className="w-full max-h-60 sm:max-h-80 md:max-h-96 object-cover"
              width={600}
              height={384}
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {post.images.slice(0, showAllImages ? post.images.length : 2).map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`Post ${index + 1}`}
                    className="w-full h-40 sm:h-56 md:h-72 object-cover"
                    width={300}
                    height={192}
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
      <div className="px-3 sm:px-4 py-3 border-t border-secondary-200 dark:border-secondary-700">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeLoading}
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