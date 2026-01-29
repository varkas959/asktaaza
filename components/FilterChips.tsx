"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const company = searchParams.get("company");
  const skill = searchParams.get("skill");
  const experienceLevel = searchParams.get("experienceLevel");
  const round = searchParams.get("round");
  const freshness = searchParams.get("freshness");
  const search = searchParams.get("search");

  const roundLabels: Record<string, string> = {
    phone: "Phone Screen",
    onsite: "Onsite",
    technical: "Technical Round",
    behavioral: "Behavioral",
    system_design: "System Design",
    other: "Other",
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  // Don't show chips for filters that are already in FilterPills (skill, round, company)
  // Only show search, experienceLevel, and freshness
  const hasActiveFilters = experienceLevel || (freshness && freshness !== "All time") || (search && search.trim());

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3">
      {search && search.trim() && (
        <button
          type="button"
          onClick={() => removeFilter("search")}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#3b82f6]/20 px-3 py-1 text-sm font-medium text-[#60a5fa] hover:bg-[#3b82f6]/30"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          &quot;{search}&quot;
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {experienceLevel && (
        <button
          type="button"
          onClick={() => removeFilter("experienceLevel")}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#334155] px-3 py-1 text-sm font-medium text-[#cbd5e1] hover:bg-[#475569]"
        >
          {experienceLevel === "0-2 years" ? "Fresher" : experienceLevel}
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {freshness && freshness !== "All time" && (
        <button
          type="button"
          onClick={() => removeFilter("freshness")}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#334155] px-3 py-1 text-sm font-medium text-[#cbd5e1] hover:bg-[#475569]"
        >
          {freshness}
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}