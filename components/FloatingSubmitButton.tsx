"use client";

import Link from "next/link";

interface FloatingSubmitButtonProps {
  href: string;
}

export function FloatingSubmitButton({ href }: FloatingSubmitButtonProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-transform hover:scale-110 hover:bg-gray-800 md:hidden"
      aria-label="Submit a Question"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}