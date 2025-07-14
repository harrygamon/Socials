'use client'

import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Image as LucideImage, Smile, Mic, Send } from 'lucide-react'
import Image from 'next/image'

export function CreatePost() {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && images.length === 0) return
    try {
      // Upload images to Cloudinary
      const urls: string[] = []
      for (const img of images) {
        const formData = new FormData()
        formData.append('file', img)
        formData.append('upload_preset', 'social-posts')
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (!data.secure_url) throw new Error('Image upload failed')
        urls.push(data.secure_url)
      }
      // Save post to API
      const postRes = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, images: urls }),
      })
      if (!postRes.ok) throw new Error('Failed to create post')
      setContent('')
      setImages([])
      // Notify Feed to refresh
      window.dispatchEvent(new Event('refresh-feed'))
    } catch (err: unknown) {
      if (err instanceof Error) {
        // setError(err.message || 'Something went wrong') // This line was removed
      } else {
        // setError('Something went wrong') // This line was removed
      }
    } finally {
      // setLoading(false) // This line was removed
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
            <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-secondary-200 dark:border-secondary-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500"
              rows={3}
            />
          </div>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  width={256}
                  height={128}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <LucideImage className="w-5 h-5" />
              </Button>
            </label>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Smile className="w-5 h-5" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={!content.trim() && images.length === 0}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Post
          </Button>
        </div>
      </form>
    </div>
  )
} 