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
  const roundButtonRef = useRef<HTMLButtonElement>(null);
  const experienceButtonRef = useRef<HTMLButtonElement>(null);
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
      !roundButtonRef.current?.contains(target) &&
      !experienceButtonRef.current?.contains(target);

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

  const getRoundLabel = (value: string | null) => {
    if (!value) return "Round";
    const round = interviewRounds.find(r => r.value === value);
    return round ? round.label : "Round";
  };

  const getExperienceLabel = (value: string | null) => {
    if (!value) return "Experience";
    return value;
  };

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

  const isAllActive = !currentSkill && !currentCompany && !currentRound && !currentExperience;

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

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* All Experiences */}
      <button
        type="button"
        onClick={clearAllFilters}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
          isAllActive
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
        }`}
      >
        All
      </button>

      {/* Experience Level Dropdown */}
      <button
        ref={experienceButtonRef}
        type="button"
        onClick={() => handleDropdownToggle("experience", experienceButtonRef)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
          currentExperience
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
        }`}
      >
        {getExperienceLabel(currentExperience)}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Technology Dropdown */}
      <button
        ref={technologyButtonRef}
        type="button"
        onClick={() => handleDropdownToggle("technology", technologyButtonRef)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
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

      {/* Company Dropdown */}
      <button
        ref={companyButtonRef}
        type="button"
        onClick={() => handleDropdownToggle("company", companyButtonRef)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
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

      {/* Interview Round Dropdown */}
      <button
        ref={roundButtonRef}
        type="button"
        onClick={() => handleDropdownToggle("round", roundButtonRef)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
          currentRound
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
        }`}
      >
        {getRoundLabel(currentRound)}
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Clear filters button - only show when filters are active */}
      {!isAllActive && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="px-3 py-2 rounded-full text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#334155] transition-colors flex items-center gap-1"
          title="Clear all filters"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}

      {/* Dropdown Portals */}
      {openDropdown === "experience" && renderDropdown(experienceLevels, "experienceLevel")}
      {openDropdown === "technology" && renderDropdown(technologies, "skill")}
      {openDropdown === "company" && renderDropdown(companies, "company")}
      {openDropdown === "round" && renderDropdown(interviewRounds, "round")}
    </div>
  );
}
