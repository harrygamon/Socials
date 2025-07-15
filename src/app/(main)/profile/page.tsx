"use client"
import { useState, useEffect, useRef } from "react";
import { Edit, Camera } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gradient-to-br from-lilac via-midnight to-teal">
      <div className="max-w-4xl mx-auto pt-16 p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-midnight mb-2">Profile</h1>
          <p className="text-purple/70">Manage your profile and settings</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-64 bg-gradient-to-br from-purple to-lilac">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end gap-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24 shadow-neumorph">
                        <AvatarImage
                          src={isEditing ? editData.image : (profile as { image: string })?.image || "/default-avatar.png"}
                          alt={(profile as { name: string })?.name}
                        />
                        <AvatarFallback>{(profile as { name: string })?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <button
                          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-neumorph border border-lilac"
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                        >
                          <Camera className="w-4 h-4 text-purple" />
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
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="ghost"
                      className="bg-white/20 backdrop-blur rounded-full p-3 hover:bg-white/30 transition-colors"
                    >
                      <Edit className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* Profile Info */}
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={editData.bio}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-midnight mb-1">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={editData.age}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-midnight mb-1">Gender</label>
                        <select
                          name="gender"
                          value={editData.gender}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 rounded-xl border border-lilac/30 focus:ring-2 focus:ring-purple focus:border-purple bg-white text-midnight"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="btn-primary"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-midnight mb-2">About</h3>
                      <p className="text-purple/80">{(profile as { bio?: string })?.bio}</p>
                    </div>
                  </>
                )}
                {/* Photos (could be user's posts with images) */}
                <div>
                  <h3 className="text-lg font-semibold text-midnight mb-3">Photos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(profile as { posts?: { mediaUrls: string[] }[] })?.posts?.flatMap((post: { mediaUrls: string[] }) => post.mediaUrls).filter(Boolean).slice(0, 6).map((image: string, index: number) => (
                      <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-neumorph">
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
          {/* Settings/Sidebar (optional, can be styled later) */}
        </div>
      </div>
    </div>
  );
} 