const trendingTags = [
  { name: '#dating', count: '2.3k posts' },
  { name: '#relationship', count: '1.8k posts' },
  { name: '#love', count: '5.2k posts' },
  { name: '#singles', count: '890 posts' },
  { name: '#matchmaking', count: '456 posts' },
  { name: '#romance', count: '1.2k posts' },
]

export default function Trending() {
  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700">
      <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-4">Trending Tags</h3>
      <div className="space-y-2">
        {trendingTags.map((tag) => (
          <div key={tag.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors cursor-pointer">
            <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">{tag.name}</span>
            <span className="text-xs text-secondary-500 dark:text-secondary-400">{tag.count}</span>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline">View all trends</button>
    </div>
  )
}
