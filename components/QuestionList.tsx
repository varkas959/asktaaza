"use client";

import { useEffect, useRef, useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { QuestionCardSkeleton } from "./QuestionCardSkeleton";
import type { Question } from "@/types";

interface QuestionListProps {
  initialQuestions: Question[];
  hasMore?: boolean;
  onLoadMore?: () => Promise<Question[]>;
}

export function QuestionList({ initialQuestions, hasMore = false, onLoadMore }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(hasMore);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreData && !isLoading && onLoadMore) {
          setIsLoading(true);
          onLoadMore()
            .then((newQuestions) => {
              if (newQuestions.length > 0) {
                setQuestions((prev) => [...prev, ...newQuestions]);
              } else {
                setHasMoreData(false);
              }
            })
            .catch((error) => {
              console.error("Error loading more questions:", error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      },
      {
        root: null,
        rootMargin: "200px", // Preload buffer - start loading 200px before reaching bottom
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMoreData, isLoading, onLoadMore]);

  return (
    <>
      <div className="space-y-5">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
      
      {/* Intersection observer target for infinite scroll */}
      {hasMoreData && (
        <div ref={observerTarget} className="space-y-5">
          {isLoading && (
            <>
              <QuestionCardSkeleton />
              <QuestionCardSkeleton />
              <QuestionCardSkeleton />
            </>
          )}
        </div>
      )}
    </>
  );
}