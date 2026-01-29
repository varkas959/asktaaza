"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { QuestionFilter } from "@/lib/validation";
import { Toast } from "./Toast";
import { filterApplied } from "@/lib/analytics";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  // Check if any filters are active
  const hasActiveFilters = 
    filters.company || 
    filters.experienceLevel || 
    filters.skill || 
    filters.round || 
    (filters.freshness && filters.freshness !== "All time");

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.company) {
      params.set("company", filters.company);
      filterApplied("company", filters.company);
    }
    if (filters.experienceLevel) {
      params.set("experienceLevel", filters.experienceLevel);
      filterApplied("experienceLevel", filters.experienceLevel);
    }
    if (filters.skill) {
      params.set("skill", filters.skill);
      filterApplied("skill", filters.skill);
    }
    if (filters.round) {
      params.set("round", filters.round);
      filterApplied("round", filters.round);
    }
    if (filters.freshness && filters.freshness !== "All time") {
      params.set("freshness", filters.freshness);
      filterApplied("freshness", filters.freshness);
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
    setShowToast(true);
    onClose();
  };

  const clearFilters = () => {
    setFilters({ freshness: "Last 30 days" });
    router.push("/");
    onClose();
  };

  const updateFilter = (key: keyof QuestionFilter, value: string | undefined) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  // Track viewport to switch between desktop drawer and mobile bottom sheet
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Swipe gesture handlers for mobile (swipe down to close)
  useEffect(() => {
    if (!isOpen || !drawerRef.current || !isMobile) return;

    const drawer = drawerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      startPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDraggingRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      currentPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const diffY = currentPosRef.current.y - startPosRef.current.y;

      // Only allow downward drag
      if (diffY > 0) {
        drawer.style.transform = `translateY(${diffY}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      
      const diffY = currentPosRef.current.y - startPosRef.current.y;
      const threshold = 80; // Minimum swipe distance to close
      
      if (diffY > threshold) {
        onClose();
      }
      
      // Reset transform
      drawer.style.transform = "";
    };

    drawer.addEventListener("touchstart", handleTouchStart);
    drawer.addEventListener("touchmove", handleTouchMove);
    drawer.addEventListener("touchend", handleTouchEnd);

    return () => {
      drawer.removeEventListener("touchstart", handleTouchStart);
      drawer.removeEventListener("touchmove", handleTouchMove);
      drawer.removeEventListener("touchend", handleTouchEnd);
      drawer.style.transform = "";
    };
  }, [isOpen, onClose, isMobile]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-70 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer / Bottom Sheet */}
      <div
        ref={drawerRef}
        className={
          isMobile
            ? "fixed inset-x-0 bottom-0 z-50 h-[80vh] rounded-t-2xl bg-[#1e293b] border-t border-[#334155] shadow-xl transition-transform"
            : "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#1e293b] border-l border-[#334155] shadow-xl transition-transform"
        }
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className={
              isMobile
                ? "flex items-center justify-center border-b border-[#334155] px-4 py-3"
                : "flex items-center justify-between border-b border-[#334155] px-4 py-3 md:px-6 md:py-4"
            }
          >
            {isMobile ? (
              <div className="flex w-full flex-col items-center">
                <span className="mb-2 h-1.5 w-12 rounded-full bg-[#475569]" />
                <h2 className="text-base font-semibold text-[#f1f5f9]">Filters</h2>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-[#f1f5f9]">Filters</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-1 text-[#94a3b8] hover:bg-[#334155] hover:text-[#f1f5f9]"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <div className="space-y-3 md:space-y-4">
              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-[#f1f5f9]">
                  Company
                </label>
                <select
                  id="company"
                  value={filters.company || ""}
                  onChange={(e) => updateFilter("company", e.target.value || undefined)}
                  className="w-full rounded-md bg-[#0f172a] border border-[#334155] px-3 py-1.5 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                >
                  <option value="">All companies</option>
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                  <option value="Wipro">Wipro</option>
                  <option value="HCL">HCL</option>
                  <option value="CTS">CTS</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Apple">Apple</option>
                  <option value="Meta">Meta</option>
                  <option value="Netflix">Netflix</option>
                </select>
              </div>

              <div>
                <label htmlFor="skill" className="mb-1.5 block text-sm font-medium text-[#f1f5f9]">
                  Technology / Skill
                </label>
                <select
                  id="skill"
                  value={filters.skill || ""}
                  onChange={(e) => updateFilter("skill", e.target.value || undefined)}
                  className="w-full rounded-md bg-[#0f172a] border border-[#334155] px-3 py-1.5 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                >
                  <option value="">All skills</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="React">React</option>
                  <option value="Node.js">Node.js</option>
                  <option value="System Design">System Design</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Data Structures">Data Structures</option>
                </select>
              </div>

              <div>
                <label htmlFor="experienceLevel" className="mb-1.5 block text-sm font-medium text-[#f1f5f9]">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  value={filters.experienceLevel || ""}
                  onChange={(e) => updateFilter("experienceLevel", e.target.value || undefined)}
                  className="w-full rounded-md bg-[#0f172a] border border-[#334155] px-3 py-1.5 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
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
                <label htmlFor="round" className="mb-1.5 block text-sm font-medium text-[#f1f5f9]">
                  Interview Round
                </label>
                <select
                  id="round"
                  value={filters.round || ""}
                  onChange={(e) => updateFilter("round", e.target.value || undefined)}
                  className="w-full rounded-md bg-[#0f172a] border border-[#334155] px-3 py-1.5 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
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
                <label htmlFor="freshness" className="mb-1.5 block text-sm font-medium text-[#f1f5f9]">
                  Time Range
                </label>
                <select
                  id="freshness"
                  value={filters.freshness || "Last 30 days"}
                  onChange={(e) => updateFilter("freshness", e.target.value || undefined)}
                  className="w-full rounded-md bg-[#0f172a] border border-[#334155] px-3 py-1.5 text-sm text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                >
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="Last 90 days">Last 90 days</option>
                  <option value="All time">All time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer - Sticky on mobile */}
          <div className="sticky bottom-0 border-t border-[#334155] bg-[#1e293b] px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex-1 rounded-md border border-[#334155] bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-[#f1f5f9] transition-colors hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0f172a]"
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="flex-1 rounded-md bg-[#3b82f6] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2563eb]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast 
        message="Filters applied" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </>
  );
}