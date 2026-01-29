export function QuestionCardSkeleton() {
  return (
    <div className="rounded-lg bg-white px-4 py-4 shadow-sm md:px-8 md:py-5">
      <div className="flex flex-col">
        {/* Question Text - Bold and Larger */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-5 w-full animate-pulse rounded bg-gray-200 md:h-6" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200 md:h-6" />
            <div className="h-5 w-3/5 animate-pulse rounded bg-gray-200 md:hidden" />
          </div>
          {/* Confidence Badge Skeleton */}
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* Desktop: Single row metadata */}
        <div className="mb-2 hidden flex-wrap items-center gap-2 md:flex">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Mobile: Stacked metadata */}
        <div className="mb-2 flex flex-col gap-1.5 md:hidden">
          {/* Line 1: Company · Skill */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          {/* Line 2: Experience · Round */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Third Row: Time posted + NEW badge (right-aligned) */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Internal links skeleton */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
