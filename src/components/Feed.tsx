'use client'

import { useEffect, useState } from 'react';
import { PostCard } from './post-card';
import Pusher, { Channel } from 'pusher-js';
import { Spinner } from './ui/Spinner';

interface Author {
  id: string;
  name: string;
  image: string;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  mediaUrls: string[];
  createdAt: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const limit = 10;

  const fetchPosts = async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.append('cursor', cursor);
    const res = await fetch(`/api/posts?${params.toString()}`);
    const data = await res.json();
    if (Array.isArray(data.posts)) {
      setPosts(prev => [...prev, ...data.posts]);
      if (data.posts.length < limit) {
        setHasMore(false);
      } else {
        setCursor(data.posts[data.posts.length - 1].id);
      }
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // Listen for refresh-feed event
    const refresh = () => {
      setPosts([]);
      setCursor(null);
      setHasMore(true);
      fetchPosts();
    };
    window.addEventListener('refresh-feed', refresh);
    return () => window.removeEventListener('refresh-feed', refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time like updates
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channels: Record<string, Channel> = {};
    posts.forEach(post => {
      if (!channels[post.id]) {
        const channel = pusher.subscribe(`post-${post.id}`);
        channel.bind('like-updated', (data: unknown) => {
          setLikeCounts(prev => ({ ...prev, [post.id]: (data as { likeCount: number }).likeCount }));
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
  }, [posts]);

  return (
    <div className="space-y-8 bg-jelly-50/60 p-2 sm:p-4 md:p-6 rounded-3xl shadow-jelly max-w-full">
      {loading && posts.length === 0 ? (
        <div className="flex justify-center py-8"><Spinner size={32} label="Loading posts..." /></div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={{
            ...post,
            images: post.mediaUrls,
            isLiked: false, // Placeholder, implement like logic as needed
            likes: likeCounts[post.id] ?? 0, // Use real-time like count if available
            comments: 0, // Placeholder
          }} />
        ))
      ) : (
        <div className="text-center text-secondary-500 py-8">No posts found.</div>
      )}
      {hasMore && !loading && (
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium mt-4 flex items-center justify-center gap-2"
        >
          {loading ? <Spinner size={20} /> : null}
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
