"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { generateSlug } from "@/lib/seo-utils";
import { questionView } from "@/lib/analytics";
import { highlightKeywords } from "@/lib/search-utils";
import { formatQuestions } from "@/lib/question-format";
import { useSearchParams } from "next/navigation";

const PREVIEW_COUNT = 3;

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const timeAgo = question.createdAt
    ? formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })
    : "";

  const questions = formatQuestions(question.content);
  const hasMore = questions.length > PREVIEW_COUNT;
  const displayQuestions = expanded ? questions : questions.slice(0, PREVIEW_COUNT);

  // Generate tags from skill, category, and round
  const roundLabels: Record<string, string> = {
    phone: "Phone",
    onsite: "Onsite",
    technical: "Technical",
    behavioral: "Behavioral",
    system_design: "System Design",
    other: "",
  };

  const tags: string[] = [];
  if (question.skill) tags.push(question.skill);
  if (question.round && roundLabels[question.round]) tags.push(roundLabels[question.round]);

  // Generate SEO-friendly URL
  const companySlug = generateSlug(question.company);
  const skillSlug = question.skill ? generateSlug(question.skill) : "general";
  const questionSlug = generateSlug(question.content.substring(0, 50));
  const questionUrl = `/interview/${companySlug}/${skillSlug}/${questionSlug}`;

  const handleClick = () => {
    questionView(question.id, question.company, question.skill || undefined);
  };

  return (
    <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-4 hover:border-[#475569] transition-colors">
      {/* Header: Company + Time */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {question.company.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#f1f5f9]">
              <span
                dangerouslySetInnerHTML={{
                  __html: searchQuery
                    ? highlightKeywords(question.company, searchQuery)
                    : question.company
                }}
              />
            </h3>
            {question.experienceLevel && (
              <span className="text-xs text-[#94a3b8]">{question.experienceLevel}</span>
            )}
          </div>
        </div>
        <span className="text-xs text-[#64748b]">{timeAgo}</span>
      </div>

      {/* Questions: show 2-3 initially, expand to show all */}
      <div className="mb-3">
        <ol className="space-y-1.5">
          {displayQuestions.map((q, index) => (
            <li
              key={index}
              className="text-sm text-[#e2e8f0] leading-relaxed flex gap-2"
            >
              <span className="text-[#64748b] flex-shrink-0">{index + 1}.</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: searchQuery
                    ? highlightKeywords(q, searchQuery)
                    : q
                }}
              />
            </li>
          ))}
        </ol>
        {hasMore && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-2 text-xs text-[#3b82f6] hover:text-[#60a5fa] font-medium"
          >
            View full questions ({questions.length} total)
          </button>
        )}
      </div>

      {/* Tags and Link */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded bg-[#334155] text-xs text-[#94a3b8]"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={questionUrl}
          onClick={handleClick}
          className="text-xs text-[#3b82f6] hover:text-[#60a5fa] font-medium"
        >
          View full questions →
        </Link>
      </div>
    </div>
  );
}
