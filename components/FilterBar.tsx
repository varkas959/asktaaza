"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { QuestionFilter } from "@/lib/validation";
import { getInterviewDetailOptions } from "@/app/actions/interview-details";

const DEFAULT_COMPANIES = ["TCS", "Infosys", "Wipro", "HCL", "CTS", "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix"];
const DEFAULT_TECHNOLOGIES = ["Java", "React", "Selenium", "Playwright", "JavaScript", "Python", "TypeScript", "Node.js", "System Design", "Algorithms", "Data Structures"];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const roundParam = searchParams.get("round");
  const validRounds = ["phone", "onsite", "technical", "behavioral", "system_design", "other"] as const;
  const roundValue = roundParam && validRounds.includes(roundParam as any) ? roundParam as typeof validRounds[number] : undefined;

  const experienceParam = searchParams.get("experienceLevel");
  const validExperience = ["0-2 years", "3-4 years", "4-6 years", "6-8 years", "8+ years"] as const;
  const experienceValue = experienceParam && validExperience.includes(experienceParam as any) ? experienceParam as typeof validExperience[number] : undefined;

  const freshnessParam = searchParams.get("freshness");
  const validFreshness = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"] as const;
  const freshnessValue = freshnessParam && validFreshness.includes(freshnessParam as any) ? freshnessParam as typeof validFreshness[number] : "Last 30 days";

  const [filters, setFilters] = useState<QuestionFilter>({
    company: searchParams.get("company") || "",
    experienceLevel: experienceValue,
    skill: searchParams.get("skill") || "",
    round: roundValue,
    freshness: freshnessValue,
  });

  const [companies, setCompanies] = useState<string[]>(DEFAULT_COMPANIES);
  const [technologies, setTechnologies] = useState<string[]>(DEFAULT_TECHNOLOGIES);
  useEffect(() => {
    getInterviewDetailOptions("company").then((r) => { if (r.success && r.data && r.data.length > 0) setCompanies(r.data); });
    getInterviewDetailOptions("technology").then((r) => { if (r.success && r.data && r.data.length > 0) setTechnologies(r.data); });
  }, []);

  // Check if any filters are active to determine if section should be open
  useEffect(() => {
    const hasActiveFilters = Boolean(
      filters.company || 
      filters.experienceLevel || 
      filters.skill || 
      filters.round || 
      (filters.freshness && filters.freshness !== "All time")
    );
    setIsOpen(hasActiveFilters);
  }, []);

  const updateFilters = (key: keyof QuestionFilter, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);

    const params = new URLSearchParams();
    
    if (newFilters.company) params.set("company", newFilters.company);
    if (newFilters.experienceLevel) params.set("experienceLevel", newFilters.experienceLevel);
    if (newFilters.skill) params.set("skill", newFilters.skill);
    if (newFilters.round) params.set("round", newFilters.round);
    if (newFilters.freshness && newFilters.freshness !== "All time") {
      params.set("freshness", newFilters.freshness);
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg px-6 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <h3 className="text-base font-medium text-gray-900">Refine Results</h3>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-700">
                Company
              </label>
              <select
                id="company"
                value={filters.company || ""}
                onChange={(e) => updateFilters("company", e.target.value || undefined)}
                className="w-full rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              >
                <option value="">All companies</option>
                {companies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="skill" className="mb-2 block text-sm font-medium text-gray-700">
                Technology / Skill
              </label>
              <select
                id="skill"
                value={filters.skill || ""}
                onChange={(e) => updateFilters("skill", e.target.value || undefined)}
                className="w-full rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              >
                <option value="">All skills</option>
                {technologies.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="experienceLevel" className="mb-2 block text-sm font-medium text-gray-700">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                value={filters.experienceLevel || ""}
                onChange={(e) => updateFilters("experienceLevel", e.target.value || undefined)}
                className="w-full rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              >
                <option value="">All levels</option>
                <option value="0-2 years">0-2 years</option>
                <option value="3-4 years">3-4 years</option>
                <option value="4-6 years">4-6 years</option>
                <option value="6-8 years">6-8 years</option>
                <option value="8+ years">8+ years</option>
              </select>
            </div>

            <div>
              <label htmlFor="round" className="mb-2 block text-sm font-medium text-gray-700">
                Interview Round
              </label>
              <select
                id="round"
                value={filters.round || ""}
                onChange={(e) => updateFilters("round", e.target.value || undefined)}
                className="w-full rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              >
                <option value="">All rounds</option>
                <option value="phone">Phone Screen</option>
                <option value="onsite">Onsite</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="system_design">System Design</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="freshness" className="mb-2 block text-sm font-medium text-gray-700">
                Time Range
              </label>
              <select
                id="freshness"
                value={filters.freshness || "Last 30 days"}
                onChange={(e) => updateFilters("freshness", e.target.value || undefined)}
                className="w-full rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              >
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 90 days">Last 90 days</option>
                <option value="All time">All time</option>
              </select>
            </div>
          </div>

          {/* Clear filters button */}
          {(filters.company || filters.experienceLevel || filters.skill || filters.round || (filters.freshness && filters.freshness !== "All time")) && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setFilters({ freshness: "Last 30 days" });
                  router.push("/");
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}