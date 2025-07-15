import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

const mockStories = [
  {
    id: 1,
    name: 'Sarah',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    name: 'Mike',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 3,
    name: 'Emma',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 4,
    name: 'Alex',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 5,
    name: 'Lisa',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 6,
    name: 'John',
    avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
  },
]

export default function StoriesBar() {
  return (
    <div className="card mb-4">
      <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
        {mockStories.map((story) => (
          <div key={story.id} className="flex flex-col items-center flex-shrink-0">
            <Avatar withRing>
              <AvatarImage src={story.avatar} alt={story.name} />
              <AvatarFallback>{story.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-midnight/80 truncate w-16 text-center mt-1 font-medium">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
