import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";

interface DiscoverCardProps {
  user: {
    id: string;
    name: string;
    age?: number;
    image?: string;
    bio?: string;
    interests?: string[];
  };
  onLike: () => void;
  onDislike: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}

export default function DiscoverCard({ user, onLike, onDislike, onSwipeLeft, onSwipeRight, disabled }: DiscoverCardProps) {
  const [animating, setAnimating] = useState<null | "left" | "right" | "none">(null);

  // Animation duration in ms
  const ANIMATION_DURATION = 350;

  // Handle swipe with animation
  const handleSwipe = (dir: "left" | "right") => {
    setAnimating(dir);
    setTimeout(() => {
      setAnimating(null);
      if (dir === "left") {
        onSwipeLeft?.();
        onDislike();
      } else {
        onSwipeRight?.();
        onLike();
      }
    }, ANIMATION_DURATION);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
  });

  // Button click handlers with animation
  const handleLikeClick = () => handleSwipe("right");
  const handleDislikeClick = () => handleSwipe("left");

  // Animation classes
  let animationClass = "";
  if (animating === "left") {
    animationClass = "animate-swipe-left";
  } else if (animating === "right") {
    animationClass = "animate-swipe-right";
  }

  return (
    <div
      {...swipeHandlers}
      className={`card w-full flex flex-col items-center p-6 mb-6 bg-white/90 rounded-2xl shadow-neumorph select-none touch-pan-y transition-transform duration-300 ease-in-out focus:outline-none ${animationClass}`}
      tabIndex={0}
      aria-label={`Profile card for ${user.name}`}
      style={{
        boxShadow: "0 8px 32px 0 rgba(80, 60, 180, 0.18), 0 1.5px 6px 0 rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={user.image || "/default-avatar.png"}
        alt={user.name}
        className="w-32 h-32 rounded-2xl object-cover mb-4 shadow-neumorph"
      />
      <h2 className="text-xl font-bold text-midnight mb-1">
        {user.name}
        {user.age ? `, ${user.age}` : null}
      </h2>
      {user.bio && <p className="text-purple/80 text-center mb-2">{user.bio}</p>}
      {user.interests && user.interests.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {user.interests.map((interest, idx) => (
            <span
              key={idx}
              className="bg-lilac/40 text-purple text-xs rounded-pill px-3 py-1 font-medium shadow-neumorph"
            >
              {interest}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-6 mt-4">
        <button
          onClick={handleDislikeClick}
          className="w-12 h-12 rounded-full bg-lilac/40 hover:bg-purple/20 flex items-center justify-center text-purple text-2xl shadow-neumorph transition-all active:scale-90 focus:ring-2 focus:ring-purple/40"
          aria-label="Dislike"
          disabled={disabled || animating !== null}
        >
          ✗
        </button>
        <button
          onClick={handleLikeClick}
          className="w-12 h-12 rounded-full bg-purple hover:bg-teal text-white text-2xl shadow-neumorph transition-all active:scale-90 focus:ring-2 focus:ring-teal/40"
          aria-label="Like"
          disabled={disabled || animating !== null}
        >
          ♥
        </button>
      </div>
    </div>
  );
}

// Tailwind CSS animations (add to your global CSS or tailwind config):
// .animate-swipe-left { transform: translateX(-400px) rotate(-18deg); opacity: 0; transition: transform 0.35s, opacity 0.35s; }
// .animate-swipe-right { transform: translateX(400px) rotate(18deg); opacity: 0; transition: transform 0.35s, opacity 0.35s; } 