'use client'
import { useState } from 'react'
import { MessageCircle, Heart } from 'lucide-react'
import Image from 'next/image'

interface Match {
  id: number
  name: string
  age: number
  image: string
  lastMessage?: string
  lastMessageTime?: string
  isOnline: boolean
  mutualInterests: string[]
}

const mockMatches: Match[] = [
  {
    id: 1,
    name: "Sarah",
    age: 25,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Hey! How's your day going?",
    lastMessageTime: "2m ago",
    isOnline: true,
    mutualInterests: ["Coffee", "Travel", "Photography"]
  },
  {
    id: 2,
    name: "Emma",
    age: 28,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    lastMessage: "That sounds amazing!",
    lastMessageTime: "1h ago",
    isOnline: false,
    mutualInterests: ["Art", "Music", "Reading"]
  },
  {
    id: 3,
    name: "Jessica",
    age: 24,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Want to grab coffee sometime?",
    lastMessageTime: "3h ago",
    isOnline: true,
    mutualInterests: ["Fitness", "Travel", "Food"]
  },
  {
    id: 4,
    name: "Amanda",
    age: 27,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Thanks for the match!",
    lastMessageTime: "1d ago",
    isOnline: false,
    mutualInterests: ["Books", "Cats", "Movies"]
  }
]

export default function MatchesPage() {
  const [matches] = useState<Match[]>(mockMatches)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto pt-16 p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Your Matches</h1>
          <p className="text-gray-600 dark:text-gray-300">Connect with people you've matched with</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-pink-500">{matches.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Matches</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-green-500">{matches.filter(m => m.isOnline).length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Online Now</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-500">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">New Messages</div>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div 
              key={match.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedMatch(match)}
            >
              {/* Profile Image */}
              <div className="relative h-48">
                <Image 
                  src={match.image} 
                  alt={match.name}
                  layout="fill"
                  objectFit="cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=Profile'
                  }}
                />
                <div className="absolute top-3 right-3">
                  <div className={`w-3 h-3 rounded-full ${match.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">{match.name}, {match.age}</h3>
                </div>
              </div>

              {/* Match Info */}
              <div className="p-4">
                {match.lastMessage && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{match.lastMessage}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{match.lastMessageTime}</p>
                  </div>
                )}

                {/* Mutual Interests */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Mutual Interests:</p>
                  <div className="flex flex-wrap gap-1">
                    {match.mutualInterests.slice(0, 3).map((interest, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
                    <Heart className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {matches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No matches yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Start swiping to find your perfect match!</p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Go to Discover
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 