"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { FilterChips } from "./FilterChips";

interface StickyNavProps {
  showSubmitButton?: boolean;
  submitHref?: string;
}

export function StickyNav({ showSubmitButton = false, submitHref = "/auth/signin" }: StickyNavProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-[#334155] bg-[#0f172a] shadow-sm">
        <div className="px-4">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Left: App name/logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#3b82f6] text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-[#f1f5f9]">AskTaaza</span>
            </Link>

            {/* Center: Desktop Search */}
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <SearchBar />
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search button - mobile only */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center rounded-md border border-[#334155] bg-[#1e293b] p-2 text-[#f1f5f9] hover:bg-[#334155] md:hidden"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Submit button - hidden on mobile; use FloatingSubmitButton there instead */}
              {showSubmitButton && (
                <Link
                  href={submitHref}
                  className="hidden md:flex items-center justify-center rounded-md bg-[#3b82f6] px-4 py-2 text-white hover:bg-[#2563eb]"
                >
                  <span className="text-sm font-medium">+ Post Question</span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Active Filter Chips */}
          <FilterChips />
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <SearchBar isMobile onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
}
