"use client";

import { useState, useEffect } from "react";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

interface BookmarkButtonProps {
  questionId: string;
  size?: "sm" | "md";
}

export function BookmarkButton({ questionId, size = "sm" }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check bookmark status on mount
  useEffect(() => {
    setSaved(isBookmarked(questionId));
  }, [questionId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = toggleBookmark(questionId);
    setSaved(newState);
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = size === "sm" 
    ? "p-1.5 rounded-md" 
    : "p-2 rounded-lg";

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${sizeClasses} transition-all duration-200 ${
        saved 
          ? "bg-[#3b82f6]/20 text-[#60a5fa] hover:bg-[#3b82f6]/30" 
          : "bg-[#334155]/50 text-[#94a3b8] hover:bg-[#334155] hover:text-[#e2e8f0]"
      } ${isAnimating ? "scale-125" : ""}`}
      aria-label={saved ? "Remove bookmark" : "Add bookmark"}
      title={saved ? "Remove from saved" : "Save for later"}
    >
      {saved ? (
        <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
        </svg>
      ) : (
        <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
    </button>
  );
}
