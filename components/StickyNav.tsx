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
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2196F3] text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <path d="M8 7h8" />
                    <path d="M8 11h8" />
                    <path d="M8 15h5" />
                  </svg>
                </div>
                <span className="text-lg font-bold">
                  <span className="text-[#f1f5f9]">Ask</span>
                  <span className="text-[#2196F3]">Taaza</span>
                </span>
              </Link>
            </div>

            {/* Center: Search */}
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <SearchBar />
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search button - mobile only (no background) */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#f1f5f9] hover:bg-[#334155] active:bg-[#475569] rounded-lg md:hidden"
                aria-label="Search"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
