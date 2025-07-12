import Image from 'next/image'

export default function MatchCard() {
  // In a real app, props would be passed in
  const match = {
    name: 'Emily Carter',
    age: 27,
    location: 'London, UK',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    mutual: 3,
  }
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-secondary-800 rounded-lg shadow border border-secondary-200 dark:border-secondary-700">
      <Image
        src={match.avatar}
        alt={match.name}
        className="w-12 h-12 rounded-full object-cover border border-secondary-200 dark:border-secondary-700"
        width={48}
        height={48}
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-secondary-900 dark:text-white truncate">{match.name}, {match.age}</div>
        <div className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{match.location}</div>
        <div className="text-xs text-primary-600 dark:text-primary-400">{match.mutual} mutual friends</div>
      </div>
      <button className="ml-2 px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-lg transition-colors">Connect</button>
    </div>
  )
}
