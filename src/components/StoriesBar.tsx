import Image from 'next/image'

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
    <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700 mb-4">
      <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
        {mockStories.map((story) => (
          <div key={story.id} className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-primary-500 flex items-center justify-center mb-1 overflow-hidden">
              <Image src={story.avatar} alt={story.name} className="w-full h-full object-cover" width={64} height={64} />
            </div>
            <span className="text-xs text-secondary-700 dark:text-secondary-300 truncate w-16 text-center">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
