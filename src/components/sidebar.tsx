'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Heart, 
  Search, 
  MessageCircle, 
  User, 
  Users,
  Sparkles
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Feed', href: '/feed', icon: Home },
  { name: 'Discover', href: '/discover', icon: Heart },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Profile', href: '/profile', icon: User },
]

const suggestedMatches = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    age: 25,
    location: 'New York, NY',
    mutualFriends: 3,
  },
  {
    id: '2',
    name: 'Mike Chen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    age: 28,
    location: 'San Francisco, CA',
    mutualFriends: 5,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    age: 23,
    location: 'Los Angeles, CA',
    mutualFriends: 2,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:pt-20 lg:pb-0 lg:overflow-y-auto lg:border-r lg:border-jelly-100 bg-white/80 dark:bg-jelly-900/80 backdrop-blur rounded-r-3xl shadow-jelly">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-base font-semibold rounded-full transition-all duration-150 shadow-jelly hover:scale-105 hover:bg-jelly-100/60 hover:text-jelly-700 ${isActive ? 'bg-jelly-200 text-jelly-900' : 'text-jelly-700'}`}
                >
                  <item.icon className="mr-3 h-6 w-6 text-jelly-400" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Suggested Matches */}
        <div className="px-4 py-6 border-t border-jelly-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-jelly-700">Suggested Matches</h3>
            <Sparkles className="h-5 w-5 text-jelly-400" />
          </div>
          <div className="space-y-3">
            {suggestedMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-jelly-50 transition-colors shadow-jelly"
              >
                <Avatar className="h-12 w-12 ring-2 ring-jelly-200">
                  <AvatarImage src={match.image} alt={match.name} />
                  <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-jelly-900 truncate">
                    {match.name}, {match.age}
                  </p>
                  <p className="text-xs text-jelly-400 truncate">
                    {match.location}
                  </p>
                  <p className="text-xs text-jelly-500">
                    {match.mutualFriends} mutual friends
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs rounded-full border-jelly-200 text-jelly-500 hover:bg-jelly-100">Connect</Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-base text-jelly-500 hover:bg-jelly-100 rounded-full">View all suggestions</Button>
        </div>
      </div>
    </aside>
  )
} 