import { Suspense } from "react";
import { getQuestions } from "@/app/actions/questions";
import { QuestionCard } from "@/components/QuestionCard";
import { StickyNav } from "@/components/StickyNav";
import { FloatingSubmitButton } from "@/components/FloatingSubmitButton";
import { FilterPills } from "@/components/FilterPills";
import { TrendingTopics } from "@/components/TrendingTopics";
import { sortQuestionsByRank } from "@/lib/ranking";
import type { QuestionFilter } from "@/lib/validation";
import type { Metadata } from "next";

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  
  // Check if filters or search are active (for metadata)
  const hasActiveFiltersForMetadata = 
    params.company || 
    params.experienceLevel || 
    params.skill || 
    params.round || 
    (params.freshness && params.freshness !== "All time") ||
    (params.search && params.search.trim());

  // Noindex filter/search pages
  if (hasActiveFiltersForMetadata) {
    return {
      title: "Filtered Interview Questions | AskTaaza",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "Recent Interview Questions | AskTaaza - Real Questions from Recent Candidates",
    description: "Browse recent interview questions from real candidates. Updated daily. No login required. Prepare for your next interview with actual questions asked at top companies.",
    openGraph: {
      title: "Recent Interview Questions | AskTaaza",
      description: "Browse recent interview questions from real candidates. Updated daily.",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface HomePageProps {
  searchParams: Promise<{
    company?: string;
    experienceLevel?: string;
    skill?: string;
    round?: string;
    freshness?: string;
    search?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // Build filters from search params
  const filters: QuestionFilter = {
    company: params.company,
    experienceLevel: params.experienceLevel as any,
    skill: params.skill,
    round: params.round as any,
    freshness: params.freshness as any,
    search: params.search,
  };

  const result = await getQuestions(filters);

  // Apply ranking algorithm
  const rankedQuestions = result.success && result.data
    ? sortQuestionsByRank(result.data)
    : [];

  // Check if filters or search are active (for empty state)
  const hasActiveFilters = 
    params.company || 
    params.experienceLevel || 
    params.skill || 
    params.round || 
    (params.freshness && params.freshness !== "All time") ||
    (params.search && params.search.trim());

  // Show trending only after 30+ questions (hide until enough content)
  const showTrending = rankedQuestions.length >= 30;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Sticky Navigation with Filters */}
      <StickyNav 
        showSubmitButton={true}
        submitHref="/submit"
      />

      {/* Main Content Area - Two columns on desktop: sidebar left, main right; single column on mobile */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Sidebar: visible on desktop (lg+) only when 30+ questions */}
          {showTrending && (
            <div className="hidden lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-[#334155]">
              <div className="sticky top-20 px-4 pt-4 pb-4">
                <TrendingTopics />
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Filter Pills */}
            <div className="px-4 pt-4 pb-4 overflow-visible">
              <FilterPills />
            </div>

            {/* Trending: horizontal scroll chips (mobile only when 30+ questions) */}
            {showTrending && (
              <div className="lg:hidden px-4 -mt-2">
                <TrendingTopics variant="inline" />
              </div>
            )}

            {/* Page Header */}
            <div className="px-4 mb-6 md:mb-8 flex items-center gap-3">
              <svg className="h-5 w-5 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h1 className="text-xl font-semibold text-[#f1f5f9] md:text-2xl">
                Recent Interview Questions
              </h1>
            </div>

            {/* Question Feed */}
            <div className="px-4">
              {rankedQuestions.length === 0 ? (
                <div className="rounded-lg bg-[#1e293b] border border-[#334155] p-8 text-center md:p-12">
                  {params.search && params.search.trim() ? (
                    <div className="space-y-2">
                      <p className="text-sm text-[#94a3b8] md:text-base">
                        No results found for &quot;{params.search}&quot;
                      </p>
                      <p className="text-xs text-[#64748b] md:text-sm">
                        Try different keywords or clear filters.
                      </p>
                    </div>
                  ) : hasActiveFilters ? (
                    <p className="text-sm text-[#94a3b8] md:text-base">
                      No recent questions match your filters. Try clearing filters or expanding the time range.
                    </p>
                  ) : (
                    <p className="text-sm text-[#94a3b8] md:text-base">No questions found. Be the first to submit one!</p>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  {rankedQuestions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Submit Button - Mobile Only */}
      <FloatingSubmitButton href="/submit" />
    </div>
  );
}