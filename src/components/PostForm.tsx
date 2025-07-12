'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

export default function PostForm() {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 4) {
      setError('You can upload up to 4 images per post.')
      return
    }
    setImages(prev => [...prev, ...files].slice(0, 4))
    setPreviews(prev => [
      ...prev,
      ...files.map(file => URL.createObjectURL(file))
    ].slice(0, 4))
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Upload images to Cloudinary
      const urls: string[] = []
      for (const img of images) {
        const formData = new FormData()
        formData.append('file', img)
        formData.append('upload_preset', 'social-posts')
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '')
        formData.append('timestamp', String(Math.floor(Date.now() / 1000)))
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
      setPreviews([])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-secondary-800 rounded-xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700 mb-6 space-y-4">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 border border-secondary-200 dark:border-secondary-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-500"
        rows={3}
        required
      />
      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative group">
              <Image src={src} alt="Preview" className="w-full h-32 object-cover rounded-lg" width={256} height={128} />
              <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
            </div>
          ))}
        </div>
      )}
      {/* Image Upload */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white rounded-lg text-sm hover:bg-secondary-200 dark:hover:bg-secondary-600"
          disabled={images.length >= 4}
        >
          {images.length < 4 ? 'Add Images' : 'Max 4 Images'}
        </button>
        <span className="text-xs text-secondary-500 dark:text-secondary-400">{images.length}/4</span>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  )
} 