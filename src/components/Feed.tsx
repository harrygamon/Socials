import PostCard from './PostCard'

const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    content: 'Just had an amazing coffee date! ☕️ #dating #coffee',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
    likes: 24,
    comments: 8,
    createdAt: '2 hours ago',
  },
  {
    id: 2,
    author: {
      name: 'Mike Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    content: 'Weekend hiking trip was incredible! #hiking #adventure',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    likes: 42,
    comments: 12,
    createdAt: '5 hours ago',
  },
  {
    id: 3,
    author: {
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    content: 'Cooking is my love language! 🍝 #cooking #food',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop',
    likes: 67,
    comments: 15,
    createdAt: '1 day ago',
  },
]

export default function Feed() {
  return (
    <div className="space-y-8 bg-jelly-50/60 p-6 rounded-3xl shadow-jelly">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
