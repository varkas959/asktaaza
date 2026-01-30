"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DropdownPosition {
  top: number;
  left: number;
}

export function FilterPills() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const technologyButtonRef = useRef<HTMLButtonElement>(null);
  const companyButtonRef = useRef<HTMLButtonElement>(null);
  const freshnessButtonRef = useRef<HTMLButtonElement>(null);
  const moreFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking/tapping outside (mousedown + touchstart for mobile)
  useEffect(() => {
    const isOutside = (target: Node) =>
      dropdownRef.current &&
      !dropdownRef.current.contains(target) &&
      !technologyButtonRef.current?.contains(target) &&
      !companyButtonRef.current?.contains(target) &&
      !freshnessButtonRef.current?.contains(target) &&
      !moreFiltersButtonRef.current?.contains(target);

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (target && isOutside(target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside, { passive: true });
      return () => {
        document.removeEventListener("mousedown", handleOutside);
        document.removeEventListener("touchstart", handleOutside);
      };
    }
  }, [openDropdown]);

  const currentSkill = searchParams.get("skill");
  const currentCompany = searchParams.get("company");
  const currentFreshness = searchParams.get("freshness");
  const currentRound = searchParams.get("round");
  const currentExperience = searchParams.get("experienceLevel");

  const technologies = [
    "Java",
    "React",
    "Selenium",
    "JavaScript",
    "Python",
    "TypeScript",
    "Node.js",
    "System Design",
    "Algorithms",
    "Data Structures",
  ];

  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Meta",
    "Netflix",
    "TCS",
    "Infosys",
    "Wipro",
    "HCL",
    "CTS",
  ];

  const interviewRounds = [
    { value: "phone", label: "📞 Phone Screen" },
    { value: "technical", label: "💻 Technical" },
    { value: "system_design", label: "🏗️ System Design" },
    { value: "behavioral", label: "🗣️ Behavioral" },
    { value: "onsite", label: "🏢 Onsite" },
  ];

  const experienceLevels = [
    { value: "0-2 years", label: "0-2 years" },
    { value: "3-4 years", label: "3-4 years" },
    { value: "4-6 years", label: "4-6 years" },
    { value: "6-8 years", label: "6-8 years" },
    { value: "8+ years", label: "8+ years" },
  ];

  const freshnessOptions = [
    { value: "Last 7 days", label: "Last 7 days" },
    { value: "Last 30 days", label: "Last 30 days" },
    { value: "Last 90 days", label: "Last 90 days" },
    { value: "All time", label: "All time" },
  ];

  const getRoundLabel = (value: string | null) => {
    if (!value) return "Round";
    const round = interviewRounds.find(r => r.value === value);
    return round ? round.label : "Round";
  };

  const getExperienceLabel = (value: string | null) => {
    if (!value) return "Experience";
    return value;
  };

  const getFreshnessLabel = (value: string | null) => {
    if (!value) return "Time range";
    return value;
  };

  // Check if any "more filters" are active
  const hasMoreFilters = currentRound || currentExperience;

  const handleDropdownToggle = (dropdown: string, buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });
      }
      setOpenDropdown(dropdown);
    }
  };

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    const queryString = params.toString();
    // Scroll to top to show filtered results
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(queryString ? `/?${queryString}` : "/");
    setOpenDropdown(null);
  };

  const clearAllFilters = () => {
    // Scroll to top when clearing filters
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/");
    setOpenDropdown(null);
  };

  const isAllActive = !currentSkill && !currentCompany && !currentRound && !currentExperience && !currentFreshness;

  const renderDropdown = (items: { value: string; label: string }[] | string[], filterKey: string) => {
    if (!mounted) return null;
    
    return createPortal(
      <div
        ref={dropdownRef}
        className="fixed w-56 rounded-lg bg-[#1e293b] border border-[#334155] shadow-2xl overflow-hidden"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          zIndex: 99999,
        }}
      >
        <div className="py-2 max-h-64 overflow-y-auto">
          {items.map((item) => {
            const isObject = typeof item === "object";
            const value = isObject ? item.value : item;
            const label = isObject ? item.label : item;
            
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateFilter(filterKey, value)}
                className="w-full px-4 py-2 text-left text-sm text-[#e2e8f0] hover:bg-[#334155] transition-colors"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>,
      document.body
    );
  };

  // Render "More filters" dropdown with nested options
  const renderMoreFiltersDropdown = () => {
    if (!mounted) return null;
    
    return createPortal(
      <div
        ref={dropdownRef}
        className="fixed w-64 rounded-lg bg-[#1e293b] border border-[#334155] shadow-2xl overflow-hidden"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          zIndex: 99999,
        }}
      >
        <div className="py-2 max-h-80 overflow-y-auto">
          {/* Experience Level Section */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-2">Experience Level</p>
            {experienceLevels.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilter("experienceLevel", currentExperience === item.value ? null : item.value)}
                className={`w-full px-3 py-2 text-left text-sm rounded transition-colors mb-1 ${
                  currentExperience === item.value
                    ? "bg-[#3b82f6] text-white"
                    : "text-[#e2e8f0] hover:bg-[#334155]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="border-t border-[#334155] my-2" />
          
          {/* Interview Round Section */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-2">Interview Round</p>
            {interviewRounds.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilter("round", currentRound === item.value ? null : item.value)}
                className={`w-full px-3 py-2 text-left text-sm rounded transition-colors mb-1 ${
                  currentRound === item.value
                    ? "bg-[#3b82f6] text-white"
                    : "text-[#e2e8f0] hover:bg-[#334155]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto overflow-y-hidden flex-nowrap scrollbar-none snap-x snap-mandatory pb-2 -mx-4 px-4 touch-pan-x scroll-pl-4"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* All */}
      <button
        type="button"
        onClick={clearAllFilters}
        className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
          isAllActive
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
        }`}
      >
        All
      </button>

      {/* Company Dropdown */}
      <button
        ref={companyButtonRef}
        type="button"
        onClick={() => handleDropdownToggle("company", companyButtonRef)}
        className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
          currentCompany
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
        }`}
      >
        {currentCompany || "Company"}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Technology Dropdown */}
      <button
        ref={technologyButtonRef}
        type="button"
        onClick={() => handleDropdownToggle("technology", technologyButtonRef)}
        className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
          currentSkill
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
        }`}
      >
        {currentSkill || "Technology"}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Time Range Dropdown */}
      <button
        ref={freshnessButtonRef}
        type="button"
        onClick={() => handleDropdownToggle("freshness", freshnessButtonRef)}
        className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
          currentFreshness
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
        }`}
      >
        {getFreshnessLabel(currentFreshness)}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* More Filters Dropdown */}
      <button
        ref={moreFiltersButtonRef}
        type="button"
        onClick={() => handleDropdownToggle("moreFilters", moreFiltersButtonRef)}
        className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
          hasMoreFilters
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
        }`}
      >
        More filters
        {hasMoreFilters && (
          <span className="ml-1 bg-white/20 rounded-full px-1.5 text-xs">
            {(currentRound ? 1 : 0) + (currentExperience ? 1 : 0)}
          </span>
        )}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Clear filters button - only show when filters are active */}
      {!isAllActive && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="flex-shrink-0 snap-start px-3 py-2 rounded-full text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#334155] transition-colors flex items-center gap-1"
          title="Clear all filters"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}

      {/* Dropdown Portals */}
      {openDropdown === "technology" && renderDropdown(technologies, "skill")}
      {openDropdown === "company" && renderDropdown(companies, "company")}
      {openDropdown === "freshness" && renderDropdown(freshnessOptions, "freshness")}
      {openDropdown === "moreFilters" && renderMoreFiltersDropdown()}
    </div>
  );
}
