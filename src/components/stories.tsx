'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const mockStories = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Sarah J.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    hasStory: true,
    isViewed: false,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Mike C.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    hasStory: true,
    isViewed: true,
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Emma W.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    hasStory: true,
    isViewed: false,
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Alex R.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    hasStory: true,
    isViewed: true,
  },
  {
    id: '5',
    user: {
      id: '5',
      name: 'Lisa K.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    hasStory: true,
    isViewed: false,
  },
]

export function Stories() {
  const [activeStory, setActiveStory] = useState<string | null>(null)

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add Story Button */}
        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="w-16 h-16 rounded-full border-2 border-dashed border-secondary-300 dark:border-secondary-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
          >
            <Plus className="w-6 h-6 text-secondary-500" />
          </Button>
          <span className="text-xs text-secondary-600 dark:text-secondary-400 text-center">
            Add Story
          </span>
        </div>

        {/* Stories */}
        {mockStories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer"
            onClick={() => setActiveStory(story.id)}
          >
            <div
              className={`w-16 h-16 rounded-full p-0.5 ${
                story.hasStory
                  ? story.isViewed
                    ? 'bg-secondary-300 dark:bg-secondary-600'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600'
                  : 'bg-secondary-200 dark:bg-secondary-700'
              }`}
            >
              <Avatar className="w-full h-full">
                <AvatarImage src={story.user.image} alt={story.user.name} />
                <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs text-secondary-600 dark:text-secondary-400 text-center max-w-16 truncate">
              {story.user.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 