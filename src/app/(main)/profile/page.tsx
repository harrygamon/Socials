'use client'
import { useState } from 'react'
import { Edit, Camera, Settings, Heart, MessageCircle, Star } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  
  const userProfile = {
    name: "Alex Johnson",
    age: 26,
    bio: "Adventure seeker, coffee enthusiast, and amateur photographer. Always looking for new experiences and meaningful connections! 📸☕️",
    location: "London, UK",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop"
    ],
    interests: ["Photography", "Travel", "Coffee", "Hiking", "Music", "Cooking"],
    stats: {
      matches: 24,
      likes: 156,
      views: 342
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto pt-16 p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your profile and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-64 bg-gradient-to-br from-pink-400 to-purple-500">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end gap-4">
                    <div className="relative">
                      <img 
                        src={userProfile.images[0]} 
                        alt={userProfile.name}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/96x96/f3f4f6/9ca3af?text=Profile'
                        }}
                      />
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="flex-1 text-white">
                      <h2 className="text-2xl font-bold">{userProfile.name}, {userProfile.age}</h2>
                      <p className="text-white/80">{userProfile.location}</p>
                    </div>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-white/20 backdrop-blur rounded-full p-3 hover:bg-white/30 transition-colors"
                    >
                      <Edit className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">About</h3>
                  <p className="text-gray-600 dark:text-gray-300">{userProfile.bio}</p>
                </div>

                {/* Interests */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <span 
                        key={index}
                        className="bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Photos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {userProfile.images.map((image, index) => (
                      <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x400/f3f4f6/9ca3af?text=Photo'
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Matches</span>
                  <span className="font-bold text-pink-500">{userProfile.stats.matches}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Likes</span>
                  <span className="font-bold text-green-500">{userProfile.stats.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Profile Views</span>
                  <span className="font-bold text-blue-500">{userProfile.stats.views}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Boost Profile
                </button>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" />
                  Super Like
                </button>
                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-pink-100 mb-4">Get unlimited likes, rewinds, and more!</p>
              <button className="w-full bg-white text-pink-500 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 