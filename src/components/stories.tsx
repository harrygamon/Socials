'use client'

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
  return (
    <div className="card p-4 mb-2">
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add Story Button */}
        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="w-16 h-16 rounded-full border-2 border-dashed border-midnight/20 hover:border-purple transition-colors flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-purple" />
          </Button>
          <span className="text-xs text-midnight/60 text-center font-medium">
            Add Story
          </span>
        </div>

        {/* Stories */}
        {mockStories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer"
          >
            <Avatar withRing={!story.isViewed} className="w-16 h-16">
              <AvatarImage src={story.user.image} alt={story.user.name} />
              <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-midnight/80 text-center max-w-16 truncate font-medium">
              {story.user.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 