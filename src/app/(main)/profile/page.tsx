"use client"
import { useState, useEffect, useRef } from "react";
import { Edit, Camera, Settings, Heart, Star } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [profile, setProfile] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
        setProfile(data.user);
        setEditData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          image: data.user.image || "",
          age: data.user.age || "",
          gender: data.user.gender || "OTHER",
          location: data.user.location || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social-posts");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.secure_url) {
      setEditData((prev: any) => ({ ...prev, image: data.secure_url }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setProfile(data.user);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto pt-16 p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your profile and settings</p>
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
                        src={isEditing ? editData.image : (profile as { image: string; name: string; age?: number; location?: string; bio?: string; posts?: { mediaUrls: string[] }[] })?.image || "/default-avatar.png"}
                        alt={(profile as { name: string })?.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/96x96/f3f4f6/9ca3af?text=Profile';
                        }}
                      />
                      {isEditing && (
                        <button
                          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg"
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                        >
                          <Camera className="w-4 h-4 text-gray-600" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                          />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 text-white">
                      <h2 className="text-2xl font-bold">{(profile as { name: string; age?: number })?.name}{(profile as { age?: number })?.age ? `, ${(profile as { age?: number })?.age}` : ''}</h2>
                      <p className="text-white/80">{(profile as { location?: string })?.location}</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-white/20 backdrop-blur rounded-full p-3 hover:bg-white/30 transition-colors"
                    >
                      <Edit className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Profile Info */}
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={editData.bio}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={editData.age}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Gender</label>
                        <select
                          name="gender"
                          value={editData.gender}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium"
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">About</h3>
                      <p className="text-gray-600 dark:text-gray-300">{(profile as { bio?: string })?.bio}</p>
                    </div>
                    {/* Interests could be added here if available */}
                  </>
                )}
                {/* Photos (could be user's posts with images) */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Photos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(profile as { posts?: { mediaUrls: string[] }[] })?.posts?.flatMap((post: { mediaUrls: string[] }) => post.mediaUrls).filter(Boolean).slice(0, 6).map((image: string, index: number) => (
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
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Posts</span>
                  <span className="font-bold text-pink-500">{(profile as { posts?: { mediaUrls: string[] }[] })?.posts?.length || 0}</span>
                </div>
                {/* Add more stats as needed */}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Boost Profile
                </button>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" />
                  Super Like
                </button>
                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
            {/* Subscription */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-pink-100 mb-4">Get unlimited likes, rewinds, and more!</p>
              <button className="w-full bg-white text-pink-500 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 