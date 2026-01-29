"use client";

import { useState } from "react";
import { ModerationTable } from "./ModerationTable";
import type { Question } from "@/types";

export type FilterTab = "all" | "active" | "flagged";

interface ModerationDashboardProps {
  questions: Question[];
}

export function ModerationDashboard({ questions }: ModerationDashboardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Calculate counts
  const activeCount = questions.filter(q => !q.isFlagged).length;
  const flaggedCount = questions.filter(q => q.isFlagged).length;

  const tabs = [
    { id: "all" as FilterTab, label: "All", count: questions.length },
    { id: "active" as FilterTab, label: "Active", count: activeCount },
    { id: "flagged" as FilterTab, label: "Flagged", count: flaggedCount },
  ];

  return (
    <div className="bg-[#1e293b] rounded-lg border border-[#334155]">
      {/* Filter Tabs */}
      <div className="border-b border-[#334155]">
        <nav className="flex -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? "border-[#3b82f6] text-[#3b82f6]"
                    : "border-transparent text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#475569]"
                }
              `}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#334155] text-[#94a3b8]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Moderation Table */}
      <ModerationTable filter={activeTab} questions={questions} />
    </div>
  );
}