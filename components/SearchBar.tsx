"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function SearchBar({ isMobile = false, onClose }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParamsRef = useRef(searchParams);
  const lastPushedQueryRef = useRef<string>(debouncedQuery.trim());
  searchParamsRef.current = searchParams;

  useEffect(() => setMounted(true), []);

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL -> state only when URL was changed from outside (e.g. back button), not by our own push
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (urlSearch === lastPushedQueryRef.current) return; // we caused this URL; don't overwrite state
    lastPushedQueryRef.current = urlSearch;
    setSearchQuery(urlSearch);
    setDebouncedQuery(urlSearch);
  }, [searchParams]);

  // Update URL when debounced query changes (do not depend on searchParams to avoid loop)
  useEffect(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    const currentSearch = params.get("search") ?? "";
    const newSearch = debouncedQuery.trim();
    if (currentSearch === newSearch) return;
    lastPushedQueryRef.current = newSearch;
    if (newSearch) params.set("search", newSearch);
    else params.delete("search");
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/", { scroll: false });
  }, [debouncedQuery, router]);

  // Focus input on mobile when opened
  useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    if (isMobile && mounted) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobile, mounted]);

  const handleClear = () => {
    setSearchQuery("");
    if (onClose) {
      onClose();
    }
  };

  // Clear input only (don't close overlay)
  const handleClearInput = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  if (isMobile && mounted) {
    const mobileOverlay = (
      <div className="fixed inset-0 z-[100] bg-[#0f172a]" style={{ touchAction: "manipulation" }}>
        <div className="flex h-full flex-col">
          {/* Mobile Search Header - Reddit style */}
          <div className="flex items-center gap-2 px-2 py-2 border-b border-[#334155]">
            {/* Back button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 p-2 text-[#94a3b8] hover:text-[#f1f5f9] active:bg-[#334155] rounded-lg"
              aria-label="Go back"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Search input */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-[#3b82f6] bg-[#1e293b] px-4 py-2.5 pr-10 text-base text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none"
                autoComplete="off"
              />
              {/* Clear button inside input */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#f1f5f9]"
                  aria-label="Clear"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Search results area (empty for now, could show suggestions) */}
          <div className="flex-1 px-4 py-4">
            {searchQuery && (
              <p className="text-sm text-[#64748b]">
                Searching for "{searchQuery}"...
              </p>
            )}
          </div>
        </div>
      </div>
    );
    return createPortal(mobileOverlay, document.body);
  }

  // Desktop inline search
  return (
    <div className="relative hidden md:block w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for roles, companies, or technologies..."
        className="w-full rounded-full border border-[#334155] bg-[#1e293b] px-6 py-3 pl-12 pr-10 text-base text-[#f1f5f9] placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
      />
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#f1f5f9]"
          aria-label="Clear search"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
