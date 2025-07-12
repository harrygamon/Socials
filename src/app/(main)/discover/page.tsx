'use client'

import { useState } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { Heart, X, Star, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const mockProfiles = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 25,
    location: 'New York, NY',
    bio: 'Adventure seeker and coffee enthusiast. Looking for someone to explore the world with! 🌍',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=500&fit=crop'
    ],
    interests: ['Travel', 'Photography', 'Hiking', 'Coffee'],
    distance: '2 miles away'
  },
  {
    id: '2',
    name: 'Mike Chen',
    age: 28,
    location: 'San Francisco, CA',
    bio: 'Tech enthusiast by day, musician by night. Let\'s create something beautiful together! 🎵',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop'
    ],
    interests: ['Music', 'Technology', 'Cooking', 'Fitness'],
    distance: '5 miles away'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    age: 23,
    location: 'Los Angeles, CA',
    bio: 'Artist and dreamer. I believe in love at first sight and second chances. ✨',
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=500&fit=crop'
    ],
    interests: ['Art', 'Poetry', 'Yoga', 'Wine'],
    distance: '8 miles away'
  },
]

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState(mockProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setCurrentImageIndex(0)
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100
    if (info.offset.x > swipeThreshold) {
      handleSwipe('right')
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe('left')
    }
  }

  const nextImage = () => {
    const currentProfile = profiles[currentIndex]
    if (currentImageIndex < currentProfile.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-secondary-200 dark:bg-secondary-700 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-secondary-400" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          No more profiles
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Check back later for new matches!
        </p>
        <Button onClick={() => setCurrentIndex(0)}>
          Start Over
        </Button>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Profile Card */}
      <div className="relative">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg overflow-hidden cursor-grab active:cursor-grabbing"
        >
          {/* Image */}
          <div className="relative h-96">
            <img
              src={currentProfile.images[currentImageIndex]}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={prevImage}
                className="w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-colors"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-colors"
              >
                →
              </button>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {currentProfile.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex
                      ? 'bg-white'
                      : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {currentProfile.location} • {currentProfile.distance}
                </p>
              </div>
            </div>

            <p className="text-secondary-700 dark:text-secondary-300 mb-4">
              {currentProfile.bio}
            </p>

            {/* Interests */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentProfile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Swipe Indicators */}
        <div className="absolute top-4 left-4">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium transform -rotate-12">
            NOPE
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium transform rotate-12">
            LIKE
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <X className="w-8 h-8" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-secondary-300 dark:border-secondary-600"
        >
          <Star className="w-8 h-8" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <Heart className="w-8 h-8" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-secondary-300 dark:border-secondary-600"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>
    </div>
  )
} 