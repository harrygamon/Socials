import { Stories } from '@/components/stories'
import { PostCard } from '@/components/post-card'
import { CreatePost } from '@/components/create-post'

const mockPosts = [
  {
    id: '1',
    author: {
      id: '1',
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Just had an amazing coffee date! ☕️ Sometimes the best connections happen over a simple cup of coffee. #dating #coffee #newbeginnings',
    images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop'],
    likes: 24,
    comments: 8,
    createdAt: '2 hours ago',
    isLiked: false,
  },
  {
    id: '2',
    author: {
      id: '2',
      name: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Weekend hiking trip was incredible! Nature has a way of bringing people together. Looking for someone to share adventures with! 🏔️ #hiking #adventure #outdoors',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=600&h=400&fit=crop'
    ],
    likes: 42,
    comments: 12,
    createdAt: '5 hours ago',
    isLiked: true,
  },
  {
    id: '3',
    author: {
      id: '3',
      name: 'Emma Wilson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Cooking is my love language! Made this pasta from scratch tonight. Who wants to join me for dinner? 🍝 #cooking #food #homemade',
    images: ['https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop'],
    likes: 67,
    comments: 15,
    createdAt: '1 day ago',
    isLiked: false,
  },
]

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stories */}
      <Stories />
      
      {/* Create Post */}
      <CreatePost />
      
      {/* Posts */}
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
} 