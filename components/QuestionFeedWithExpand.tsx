"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import type { Question } from "@/types";

const INITIAL_LIMIT = 5;

interface QuestionFeedWithExpandProps {
  questions: Question[];
  emptyState: React.ReactNode;
}

export function QuestionFeedWithExpand({ questions, emptyState }: QuestionFeedWithExpandProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = questions.length > INITIAL_LIMIT;
  const displayQuestions = expanded ? questions : questions.slice(0, INITIAL_LIMIT);

  if (questions.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-5">
      {displayQuestions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
      {hasMore && !expanded && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full border border-[#334155] bg-[#1e293b] px-6 py-3 text-sm font-medium text-[#f1f5f9] hover:bg-[#334155] transition-colors"
          >
            View full questions ({questions.length} total)
          </button>
        </div>
      )}
    </div>
  );
}
