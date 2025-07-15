"use client";
import { useState, useEffect } from "react";
import DiscoverCard from "@/components/DiscoverCard";

interface User {
  id: string;
  name: string;
  age?: number;
  image?: string;
  bio?: string;
  interests?: string[];
  gender?: string;
  location?: string;
}

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [matchModal, setMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/match/potential");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAction = async (liked: boolean) => {
    if (!users[current]) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/match/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: users[current].id, liked }),
      });
      const result = await res.json();
      if (result.isMatch) {
        setMatchedUser(users[current]);
        setMatchModal(true);
      }
      setCurrent((c) => c + 1);
    } catch (err) {
      // Optionally handle error
    } finally {
      setActionLoading(false);
    }
  };

  const user = users[current];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-lilac via-midnight to-teal p-4">
      <h1 className="text-3xl font-bold text-midnight mb-8">Discover</h1>
      <div className="w-full max-w-xs md:max-w-md flex flex-col items-center">
        {loading ? (
          <div className="text-purple/70 mt-12">Loading users...</div>
        ) : error ? (
          <div className="text-red-500 mt-12">{error}</div>
        ) : user ? (
          <DiscoverCard
            user={user}
            onLike={() => handleAction(true)}
            onDislike={() => handleAction(false)}
            disabled={actionLoading}
          />
        ) : (
          <div className="text-center text-purple/70 mt-12">No more users to discover right now.</div>
        )}
      </div>
      {/* Match Modal */}
      {matchModal && matchedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-8 shadow-neumorph flex flex-col items-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold mb-2 text-midnight">It's a match!</h2>
            <img src={matchedUser.image || "/default-avatar.png"} alt={matchedUser.name} className="w-20 h-20 rounded-2xl object-cover mb-2" />
            <div className="text-purple mb-4">You and {matchedUser.name} like each other!</div>
            <button
              className="px-6 py-2 bg-purple text-white rounded-lg shadow-neumorph hover:bg-teal transition-all"
              onClick={() => setMatchModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 