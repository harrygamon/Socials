'use client'
import { useState } from 'react'
import { Heart, X, Star, MessageCircle } from 'lucide-react'

interface Profile {
  id: number
  name: string
  age: number
  bio: string
  image: string
  distance: string
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Sarah",
    age: 25,
    bio: "Adventure seeker and coffee enthusiast ☕️",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop",
    distance: "2 miles away"
  },
  {
    id: 2,
    name: "Emma",
    age: 28,
    bio: "Artist by day, dreamer by night 🎨",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    distance: "5 miles away"
  },
  {
    id: 3,
    name: "Jessica",
    age: 24,
    bio: "Fitness lover and travel addict ✈️",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
    distance: "1 mile away"
  },
  {
    id: 4,
    name: "Amanda",
    age: 27,
    bio: "Bookworm and cat person 📚🐱",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    distance: "3 miles away"
  }
]

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction)
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwipeDirection(null)
    }, 300)
  }

  const handleLike = () => handleSwipe('right')
  const handleDislike = () => handleSwipe('left')

  const currentProfile = profiles[currentIndex]

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No more profiles</h2>
          <p className="text-gray-600 dark:text-gray-300">Check back later for new matches!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-16">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Discover</h1>
          <p className="text-gray-600 dark:text-gray-300">Swipe right to like, left to pass</p>
        </div>

        {/* Profile Card */}
        <div className="relative">
          <div 
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 ${
              swipeDirection === 'left' ? 'transform -translate-x-full rotate-12' :
              swipeDirection === 'right' ? 'transform translate-x-full -rotate-12' : ''
            }`}
          >
            {/* Profile Image */}
            <div className="relative h-96">
              <img 
                src={currentProfile.image} 
                alt={currentProfile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x600/f3f4f6/9ca3af?text=Profile+Image'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Profile Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-bold mb-1">{currentProfile.name}, {currentProfile.age}</h2>
                <p className="text-sm opacity-90 mb-2">{currentProfile.distance}</p>
                <p className="text-sm">{currentProfile.bio}</p>
              </div>
            </div>
          </div>

          {/* Swipe Indicators */}
          {swipeDirection === 'left' && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12">
              NOPE
            </div>
          )}
          {swipeDirection === 'right' && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold transform rotate-12">
              LIKE
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={handleDislike}
            className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          
          <button
            onClick={() => {/* Super like functionality */}}
            className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Star className="w-8 h-8 text-blue-500" />
          </button>
          
          <button
            onClick={handleLike}
            className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart className="w-8 h-8 text-green-500" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Message</span>
          </button>
        </div>
      </div>
    </div>
  )
} 