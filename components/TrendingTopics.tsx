"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrendingTopics } from "@/app/actions/questions";

interface Topic {
  name: string;
  count: number;
  period?: string;
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

interface TrendingTopicsProps {
  /** "sidebar" = vertical list (desktop sidebar/drawer), "inline" = horizontal scroll chips (mobile feed) */
  variant?: "sidebar" | "inline";
}

export function TrendingTopics({ variant = "sidebar" }: TrendingTopicsProps) {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const result = await getTrendingTopics();
        if (result.success && result.data) {
          setTopics(result.data);
        }
      } catch (error) {
        console.error("Error fetching trending topics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  // If no data, show placeholder topics
  const displayTopics = topics.length > 0 ? topics : [
    { name: "SystemDesign", count: 0, period: "this week" },
    { name: "JavaScript", count: 0, period: "this week" },
    { name: "React", count: 0, period: "this week" },
  ];

  const handleTopicClick = (topicName: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`/?skill=${encodeURIComponent(topicName)}`);
  };

  const handleSeeAll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/trending");
  };

  // Inline: horizontal scroll chip row (for mobile feed)
  if (variant === "inline") {
    if (loading) {
      return (
        <div className="flex gap-2 overflow-hidden pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 flex-shrink-0 rounded-full bg-[#334155] animate-pulse" />
          ))}
        </div>
      );
    }
    if (displayTopics.length === 0 && topics.length === 0) {
      return null;
    }
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#94a3b8]">Trending</span>
          <button
            type="button"
            onClick={handleSeeAll}
            className="text-xs text-[#3b82f6] hover:text-[#60a5fa] cursor-pointer font-medium"
          >
            See all
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {displayTopics.map((topic, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTopicClick(topic.name)}
              className="flex-shrink-0 min-h-[44px] px-4 py-2 rounded-full bg-[#1e293b] border border-[#334155] text-[#f1f5f9] text-sm font-medium hover:bg-[#334155] active:bg-[#475569] transition-colors cursor-pointer"
            >
              #{topic.name}
              {topic.count > 0 && (
                <span className="ml-1.5 text-[#64748b] font-normal text-xs">{formatCount(topic.count)}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Sidebar: vertical list (default)
  if (loading) {
    return (
      <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 w-20 bg-[#334155] rounded animate-pulse" />
          <div className="h-3 w-10 bg-[#334155] rounded animate-pulse" />
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 bg-[#334155] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-[#f1f5f9]">Trending Topics</h3>
        <button
          type="button"
          onClick={handleSeeAll}
          className="text-[11px] text-[#3b82f6] hover:text-[#60a5fa] cursor-pointer"
        >
          See all
        </button>
      </div>
      <div className="space-y-1.5">
        {displayTopics.map((topic, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleTopicClick(topic.name)}
            className="w-full text-left px-2.5 py-1.5 rounded bg-[#0f172a] hover:bg-[#334155] transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className="text-xs text-[#f1f5f9]">#{topic.name}</span>
            <span className="text-[10px] text-[#64748b]">{formatCount(topic.count)}</span>
          </button>
        ))}
      </div>
      {topics.length === 0 && !loading && (
        <p className="text-[10px] text-[#64748b] mt-2 text-center">
          No trending topics yet.
        </p>
      )}
    </div>
  );
}
