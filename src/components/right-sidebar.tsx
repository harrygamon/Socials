'use client'

import { TrendingUp, Hash, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

const trendingTags = [
  { name: '#dating', count: '2.3k posts' },
  { name: '#relationship', count: '1.8k posts' },
  { name: '#love', count: '5.2k posts' },
  { name: '#singles', count: '890 posts' },
  { name: '#matchmaking', count: '456 posts' },
  { name: '#romance', count: '1.2k posts' },
]

const recentActivity = [
  {
    id: '1',
    type: 'match',
    user: 'Sarah J.',
    action: 'matched with you',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'like',
    user: 'Mike C.',
    action: 'liked your post',
    time: '4 hours ago',
  },
  {
    id: '3',
    type: 'message',
    user: 'Emma W.',
    action: 'sent you a message',
    time: '6 hours ago',
  },
  {
    id: '4',
    type: 'follow',
    user: 'Alex R.',
    action: 'started following you',
    time: '1 day ago',
  },
]

export function RightSidebar() {
  return (
    <aside className="hidden xl:flex xl:flex-col xl:w-80 xl:fixed xl:right-0 xl:inset-y-0 xl:pt-20 xl:pb-0 xl:overflow-y-auto xl:border-l xl:border-jelly-100 bg-white/80 dark:bg-jelly-900/80 backdrop-blur rounded-l-3xl shadow-jelly">
      <div className="flex flex-col h-full">
        {/* Trending Tags */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-jelly-700">Trending Tags</h3>
            <TrendingUp className="h-5 w-5 text-jelly-400" />
          </div>
          <div className="space-y-2">
            {trendingTags.map((tag) => (
              <div
                key={tag.name}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-jelly-50 transition-colors cursor-pointer shadow-jelly"
              >
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-jelly-300" />
                  <span className="text-base text-jelly-900 font-semibold">
                    {tag.name}
                  </span>
                </div>
                <span className="text-xs text-jelly-400">
                  {tag.count}
                </span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-base text-jelly-500 hover:bg-jelly-100 rounded-full">View all trends</Button>
        </div>

        {/* Recent Activity */}
        <div className="px-4 py-6 border-t border-jelly-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-jelly-700">Recent Activity</h3>
            <Calendar className="h-5 w-5 text-jelly-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-2 rounded-xl hover:bg-jelly-50 transition-colors shadow-jelly"
              >
                <div className="w-2 h-2 bg-jelly-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-base text-jelly-900 font-semibold">
                    <span className="font-bold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-jelly-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-base text-jelly-500 hover:bg-jelly-100 rounded-full">View all activity</Button>
        </div>

        {/* Premium Upgrade */}
        <div className="px-4 py-6 border-t border-jelly-100 mt-auto">
          <div className="bg-gradient-to-r from-jelly-400 to-jelly-600 rounded-2xl p-6 text-white shadow-jelly">
            <h3 className="text-base font-bold mb-2">Upgrade to Premium</h3>
            <p className="text-xs text-jelly-100 mb-3">
              Get unlimited matches, advanced filters, and priority support.
            </p>
            <Button size="lg" variant="secondary" className="w-full text-base rounded-full bg-white/30 text-white hover:bg-white/50 shadow-jelly">Upgrade Now</Button>
          </div>
        </div>
      </div>
    </aside>
  )
} 