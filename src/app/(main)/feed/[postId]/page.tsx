'use client'

import { PostCard } from '@/components/post-card';
import { notFound } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

// Define Post interface at the top:
interface Post {
  id: string;
  author: { id: string; name: string; image: string };
  mediaUrls: string[];
  isLiked?: boolean;
  likes: number;
  commentsCount?: number;
  content: string;
  createdAt: string;
  [key: string]: any;
}

// Define Comment interface for comments if not present
interface Comment {
  id: string;
  user: { id: string; name: string; image: string };
  content: string;
  createdAt: string;
}

export default function PostDetailPage({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/posts/${params.postId}`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          notFound();
        }
        const data = await res.json();
        if (!data.post) {
          notFound();
        }
        setPost(data.post);
      } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.postId]);

  if (loading) {
    return <div className="flex justify-center py-8"><Spinner size={32} label="Loading post..." /></div>;
  }

  if (!post) {
    notFound();
  }

  return <PostDetailClient post={post} />;
}

function PostDetailClient({ post }: { post: Post }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${post.id}/comment`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
      } else {
        setError(data.error || 'Failed to load comments');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  // Real-time updates with Pusher
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`post-${post.id}`);
    const handler = (comment: Comment) => {
      setComments(prev => prev.some(c => (c as any).id === (comment as any).id) ? prev : [...prev, comment]);
    };
    channel.bind('new-comment', handler);
    return () => {
      channel.unbind('new-comment', handler);
      pusher.unsubscribe(`post-${post.id}`);
      pusher.disconnect();
    };
  }, [post.id]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`post-${post.id}`);
    const handler = (data: { postId: string; likeCount: number }) => {
      if ((data as any).postId === post.id) setLikeCount((data as any).likeCount);
    };
    channel.bind('like-updated', handler);
    return () => {
      channel.unbind('like-updated', handler);
      pusher.unsubscribe(`post-${post.id}`);
      pusher.disconnect();
    };
  }, [post.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(prev => [...prev, data.comment]);
        setContent('');
        toast.success('Comment posted!');
      } else {
        setError(data.error || 'Failed to add comment');
        toast.error(data.error || 'Failed to add comment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
      toast.error(err.message || 'Failed to add comment');
    } finally {
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <PostCard post={{
        ...post,
        images: post.mediaUrls,
        isLiked: post.isLiked ?? false,
        likes: likeCount,
        comments: post.commentsCount ?? 0,
        content: post.content,
        createdAt: post.createdAt,
      }} />
      <CommentsSection postId={post.id} />
    </div>
  );
}

function CommentsSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
      } else {
        setError(data.error || 'Failed to load comments');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  // Real-time updates with Pusher
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`post-${postId}`);
    const handler = (comment: Comment) => {
      setComments(prev => prev.some(c => (c as any).id === (comment as any).id) ? prev : [...prev, comment]);
    };
    channel.bind('new-comment', handler);
    return () => {
      channel.unbind('new-comment', handler);
      pusher.unsubscribe(`post-${postId}`);
      pusher.disconnect();
    };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(prev => [...prev, data.comment]);
        setContent('');
        toast.success('Comment posted!');
      } else {
        setError(data.error || 'Failed to add comment');
        toast.error(data.error || 'Failed to add comment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
      toast.error(err.message || 'Failed to add comment');
    } finally {
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Comments</h3>
      {loading ? (
        <div className="flex items-center gap-2 text-secondary-500"><Spinner size={20} label="Loading comments..." /> Loading comments...</div>
      ) : error ? (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-secondary-500">No comments yet.</div>
      ) : (
        <div className="space-y-4 mb-4 bg-secondary-50 dark:bg-secondary-900/40 p-4 rounded-xl">
          {comments.map((comment: Comment) => (
            <div key={(comment as any).id} className="flex items-start gap-3 p-2 bg-white/80 dark:bg-secondary-800/80 rounded-lg border border-secondary-200 dark:border-secondary-700 shadow-sm">
              <Image
                src={(comment as any).user.image || '/default-avatar.png'}
                alt={(comment as any).user.name}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border-2 border-primary-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-secondary-900 dark:text-white truncate">{comment.user.name}</div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400">{new Date((comment as any).createdAt).toLocaleString()}</div>
                </div>
                <div className="text-secondary-900 dark:text-white text-sm mt-1 break-words">{comment.content}</div>
              </div>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>
      )}
      {session?.user && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <Image
            src={session.user.image || '/default-avatar.png'}
            alt="Me"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-primary-200"
          />
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
            disabled={!content.trim()}
          >
            {content.trim() ? 'Post' : <Spinner size={16} />}
          </button>
        </form>
      )}
    </div>
  );
} 