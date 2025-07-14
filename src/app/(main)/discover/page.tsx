'use client'
import { useState } from 'react'
import { Heart, X, Star, MessageCircle } from 'lucide-react'
import { useEffect } from 'react';
import Pusher from 'pusher-js';
import type { Channel } from 'pusher-js';
import { Spinner } from '@/components/ui/Spinner';
import Image from 'next/image';

interface Profile {
  id: number
  name: string
  age: number
  bio: string
  image: string
  distance: string
}

// Define Post interface for trending/posts if not present
interface Post {
  id: string;
  author: { id: string; name: string; image: string };
  content: string;
  mediaUrls: string[];
  createdAt: string;
  [key: string]: any;
}

export default function DiscoverPage() {
  const [profiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  // Search state
  const [searchType, setSearchType] = useState<'user' | 'post'>('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Filter state
  // User filters
  const [filterGender, setFilterGender] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterAgeMin, setFilterAgeMin] = useState('');
  const [filterAgeMax, setFilterAgeMax] = useState('');
  // Post filters
  const [filterDate, setFilterDate] = useState(''); // '', 'week', 'month'
  const [filterContentType, setFilterContentType] = useState(''); // '', 'text', 'image'

  // Trending posts state
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingDate, setTrendingDate] = useState('');
  const [trendingContentType, setTrendingContentType] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      setTrendingLoading(true);
      try {
        let url = '/api/posts/trending';
        const params = [];
        if (trendingDate) params.push(`date=${encodeURIComponent(trendingDate)}`);
        if (trendingContentType) params.push(`contentType=${encodeURIComponent(trendingContentType)}`);
        if (params.length) url += '?' + params.join('&');
        const res = await fetch(url);
        const data: any = await res.json();
        if (!res.ok && data.error) throw new Error(data.error || 'Failed to fetch trending posts');
        setTrendingPosts(data.posts);
      } catch (err: any) {
        setSearchError(err.message || 'Failed to load trending posts');
      } finally {
        setTrendingLoading(false);
      }
    };
    fetchTrending();
  }, [trendingDate, trendingContentType]);

  // Real-time like updates for trending posts
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channels: Record<string, Channel> = {};
    trendingPosts.forEach(post => {
      if (!channels[post.id]) {
        const channel = pusher.subscribe(`post-${post.id}`);
        channel.bind('like-updated', (data: any) => {
          setTrendingPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: data.likeCount } : p));
        });
        channels[post.id] = channel;
      }
    });
    return () => {
      Object.values(channels).forEach(channel => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
      pusher.disconnect();
    };
  }, [trendingPosts]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);
    try {
      let url = `/api/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`;
      if (searchType === 'user') {
        if (filterGender) url += `&gender=${encodeURIComponent(filterGender)}`;
        if (filterLocation) url += `&location=${encodeURIComponent(filterLocation)}`;
        if (filterAgeMin) url += `&ageMin=${encodeURIComponent(filterAgeMin)}`;
        if (filterAgeMax) url += `&ageMax=${encodeURIComponent(filterAgeMax)}`;
      } else if (searchType === 'post') {
        if (filterDate) url += `&date=${encodeURIComponent(filterDate)}`;
        if (filterContentType) url += `&contentType=${encodeURIComponent(filterContentType)}`;
      }
      const res = await fetch(url);
      const data: any = await res.json();
      if (!res.ok && data.error) throw new Error(data.error || 'Search failed');
      setSearchResults(data.results);
    } catch (err: any) {
      setSearchError(err.message || 'Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction)
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwipeDirection(null)
    }, 300)
  }

  const handleLike = () => handleSwipe('right')
  const handleDislike = () => handleSwipe('left')

  const currentProfile = profiles[currentIndex]

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No more profiles</h2>
          <p className="text-gray-600 dark:text-gray-300">Check back later for new matches!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-16 space-y-10">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Discover</h1>
          <p className="text-gray-600 dark:text-gray-300">Swipe right to like, left to pass</p>
        </div>

        {/* Filter UI */}
        <div className="mb-2 flex flex-wrap gap-2 items-center">
          {searchType === 'user' && (
            <>
              <select
                value={filterGender}
                onChange={e => setFilterGender(e.target.value)}
                className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm"
              >
                <option value="">Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="text"
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                placeholder="Location"
                className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm w-28"
              />
              <input
                type="number"
                value={filterAgeMin}
                onChange={e => setFilterAgeMin(e.target.value)}
                placeholder="Min Age"
                min={0}
                className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm w-20"
              />
              <input
                type="number"
                value={filterAgeMax}
                onChange={e => setFilterAgeMax(e.target.value)}
                placeholder="Max Age"
                min={0}
                className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm w-20"
              />
            </>
          )}
          {searchType === 'post' && (
            <>
              <select
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm"
              >
                <option value="">Date</option>
                <option value="recent">Recent</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={filterContentType}
                onChange={e => setFilterContentType(e.target.value)}
                className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm"
              >
                <option value="">All Types</option>
                <option value="text">Text Only</option>
                <option value="image">Image</option>
              </select>
            </>
          )}
        </div>

        {/* Search Section */}
        <section className="bg-white/70 dark:bg-secondary-900/70 rounded-xl shadow p-4 mb-2 border border-secondary-200 dark:border-secondary-700">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <select
              value={searchType}
              onChange={e => setSearchType(e.target.value as 'user' | 'post')}
              className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
            >
              <option value="user">Users</option>
              <option value="post">Posts</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${searchType === 'user' ? 'users' : 'posts'}...`}
              className="flex-1 px-3 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-1 rounded-lg font-medium"
              disabled={searchLoading}
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {/* Search Results */}
          {searchError && <div className="text-red-500 text-sm mb-2">{searchError}</div>}
          {searchLoading && (
            <div className="space-y-2 mb-4 flex items-center justify-center"><Spinner size={20} label="Searching..." /></div>
          )}
          {!searchLoading && searchResults.length === 0 && searchQuery && (
            <div className="text-secondary-500 text-center mb-4">No {searchType === 'user' ? 'users' : 'posts'} found for &quot;{searchQuery}&quot;.</div>
          )}
          {searchResults.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Search Results</h3>
              <div className="space-y-2">
                {searchType === 'user' ? (
                  searchResults.map((user: Profile) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 bg-white dark:bg-secondary-800 rounded-lg shadow border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-shadow group">
                      <Image
                        src={user.image || '/default-avatar.png'}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary-200 group-hover:border-primary-400 transition-all"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-secondary-900 dark:text-white truncate">{user.name}</div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{user.bio}</div>
                      </div>
                      <a href={`/profile/${user.id}`} className="ml-2 px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-lg transition-colors">View</a>
                    </div>
                  ))
                ) : (
                  searchResults.map((post: any) => (
                    <div key={post.id} className="p-2 bg-white dark:bg-secondary-800 rounded-lg shadow border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-shadow group">
                      <div className="flex items-center gap-2 mb-1">
                        <Image
                          src={post.author.image || '/default-avatar.png'}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border-2 border-primary-200 group-hover:border-primary-400 transition-all"
                        />
                        <span className="font-medium text-secondary-900 dark:text-white">{post.author.name}</span>
                        <span className="text-xs text-secondary-500 dark:text-secondary-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-secondary-900 dark:text-white text-sm mb-1">{post.content}</div>
                      {post.mediaUrls?.length > 0 && (
                        <div className="flex gap-2 mt-1">
                          {post.mediaUrls.slice(0, 2).map((img: string, i: number) => (
                            <Image
                              key={i}
                              src={img}
                              alt="Post"
                              width={64}
                              height={64}
                              className="w-16 h-16 object-cover rounded-lg border border-secondary-200"
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-secondary-500 dark:text-secondary-400">
                        <span>❤️ {post.likes ?? 0}</span>
                        <span>💬 {post.commentsCount ?? 0}</span>
                      </div>
                      <a href={`/feed/${post.id}`} className="inline-block mt-2 px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-lg transition-colors">View Post</a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="h-6 flex items-center justify-center">
          <span className="w-24 h-1 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300 rounded-full opacity-40" />
        </div>

        {/* Trending Posts Section */}
        <section className="bg-white/70 dark:bg-secondary-900/70 rounded-xl shadow p-4 mb-2 border border-secondary-200 dark:border-secondary-700">
          <div className="mb-2 flex flex-wrap gap-2 items-center">
            <select
              value={trendingDate}
              onChange={e => setTrendingDate(e.target.value)}
              className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm"
            >
              <option value="">Date</option>
              <option value="recent">Recent</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select
              value={trendingContentType}
              onChange={e => setTrendingContentType(e.target.value)}
              className="px-2 py-1 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm"
            >
              <option value="">All Types</option>
              <option value="text">Text Only</option>
              <option value="image">Image</option>
            </select>
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Trending Posts</h3>
          {trendingLoading && (
            <div className="space-y-2 mb-2 flex items-center justify-center"><Spinner size={28} label="Loading trending posts..." /></div>
          )}
          {!trendingLoading && trendingPosts.length === 0 && (
            <div className="text-secondary-500 text-center">No trending posts found.</div>
          )}
          <div className="space-y-2">
            {trendingPosts.map((post: Post) => (
              <div key={post.id} className="p-2 bg-white dark:bg-secondary-800 rounded-lg shadow border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-shadow group">
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src={post.author.image || '/default-avatar.png'}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-200 group-hover:border-primary-400 transition-all"
                  />
                  <span className="font-medium text-secondary-900 dark:text-white">{post.author.name}</span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-secondary-900 dark:text-white text-sm mb-1">{post.content}</div>
                {post.mediaUrls?.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    {post.mediaUrls.slice(0, 2).map((img: string, i: number) => (
                      <Image
                        key={i}
                        src={img}
                        alt="Post"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg border border-secondary-200"
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-secondary-500 dark:text-secondary-400">
                  <span>❤️ {post.likes ?? 0}</span>
                  <span>💬 {post.commentsCount ?? 0}</span>
                </div>
                <a href={`/feed/${post.id}`} className="inline-block mt-2 px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-lg transition-colors">View Post</a>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-6 flex items-center justify-center">
          <span className="w-24 h-1 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300 rounded-full opacity-40" />
        </div>

        {/* Swipe Card (existing) */}
        {currentProfile ? (
          <section className="bg-white/80 dark:bg-secondary-900/80 rounded-2xl shadow-xl p-4">
            {/* Profile Card */}
            <div className="relative">
              <div
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 ${
                  swipeDirection === 'left' ? 'transform -translate-x-full rotate-12' :
                  swipeDirection === 'right' ? 'transform translate-x-full -rotate-12' : ''
                }`}
              >
                {/* Profile Image */}
                <div className="relative h-96">
                  <Image
                    src={currentProfile.image}
                    alt={currentProfile.name}
                    layout="fill"
                    objectFit="cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x600/f3f4f6/9ca3af?text=Profile+Image'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Profile Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-2xl font-bold mb-1">{currentProfile.name}, {currentProfile.age}</h2>
                    <p className="text-sm opacity-90 mb-2">{currentProfile.distance}</p>
                    <p className="text-sm">{currentProfile.bio}</p>
                  </div>
                </div>
              </div>
              {/* Swipe Indicators */}
              {swipeDirection === 'left' && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12">
                  NOPE
                </div>
              )}
              {swipeDirection === 'right' && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold transform rotate-12">
                  LIKE
                </div>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                onClick={handleDislike}
                className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-secondary-200 dark:border-secondary-700"
              >
                <X className="w-8 h-8 text-red-500" />
              </button>
              <button
                onClick={() => {/* Super like functionality */}}
                className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-secondary-200 dark:border-secondary-700"
              >
                <Star className="w-8 h-8 text-blue-500" />
              </button>
              <button
                onClick={handleLike}
                className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-secondary-200 dark:border-secondary-700"
              >
                <Heart className="w-8 h-8 text-green-500" />
              </button>
            </div>
            {/* Quick Actions */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow border border-secondary-200 dark:border-secondary-700">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Message</span>
              </button>
            </div>
          </section>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No more profiles</h2>
            <p className="text-gray-600 dark:text-gray-300">Check back later for new matches!</p>
          </div>
        )}
      </div>
    </div>
  )
} 