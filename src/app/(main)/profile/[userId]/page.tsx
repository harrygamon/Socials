"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// Define Profile interface at the top:
interface Profile {
  id: string;
  name: string;
  age?: number;
  location?: string;
  image?: string;
  bio?: string;
  posts?: { mediaUrls: string[] }[];
}

export default function OtherUserProfilePage() {
  const { userId } = useParams() as { userId: string };
  // Use Profile instead of unknown for profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
        setProfile(data.user);
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div className="text-center py-12">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto pt-16 p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{profile.name}{profile.age ? `, ${profile.age}` : ''}</h1>
          <p className="text-gray-600 dark:text-gray-300">{profile.location}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-64 bg-gradient-to-br from-pink-400 to-purple-500">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end gap-4">
                    <div className="relative">
                      <Image
                        src={profile.image || "/default-avatar.png"}
                        alt={profile.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/96x96/f3f4f6/9ca3af?text=Profile';
                        }}
                      />
                    </div>
                    <div className="flex-1 text-white">
                      <h2 className="text-2xl font-bold">{profile.name}{profile.age ? `, ${profile.age}` : ''}</h2>
                      <p className="text-white/80">{profile.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Profile Info */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">About</h3>
                  <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
                </div>
                {/* Photos (user's posts with images) */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Photos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {profile.posts?.flatMap((post: unknown) => (post as { mediaUrls: string[] }).mediaUrls).filter(Boolean).slice(0, 6).map((image: string, index: number) => (
                      <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Photo ${index + 1}`}
                          width={300}
                          height={400}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x400/f3f4f6/9ca3af?text=Photo';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats (could be dynamic in the future) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Posts</span>
                  <span className="font-bold text-pink-500">{profile.posts?.length || 0}</span>
                </div>
                {/* Add more stats as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 