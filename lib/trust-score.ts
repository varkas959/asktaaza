// Calculate trust/confidence score for questions

import type { Question } from "@/types";

export type ConfidenceLevel = "high" | "medium" | "low";

export function calculateConfidence(question: Question): ConfidenceLevel {
  let score = 0;

  // Source: Asked directly is more reliable
  if (question.source === "direct") {
    score += 3;
  } else if (question.source === "other") {
    score += 1;
  }

  // Metadata completeness
  if (question.company) score += 1;
  if (question.skill) score += 1;
  if (question.experienceLevel) score += 1;
  if (question.round) score += 1;
  if (question.category) score += 1;

  // Determine confidence level
  if (score >= 6) return "high";
  if (score >= 4) return "medium";
  return "low";
}

export function getConfidenceLabel(level: ConfidenceLevel): string {
  switch (level) {
    case "high":
      return "High Confidence";
    case "medium":
      return "Medium Confidence";
    case "low":
      return "Low Confidence";
  }
}

export function getConfidenceColor(level: ConfidenceLevel): {
  bg: string;
  text: string;
  border: string;
} {
  switch (level) {
    case "high":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
      };
    case "medium":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
      };
    case "low":
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
      };
  }
}

// Simulate contributor reputation (in real app, this would come from backend)
export function getContributorType(): "trusted" | "new" {
  if (typeof window === "undefined") return "new";
  
  // Check localStorage for submission history
  const stored = localStorage.getItem("question_submissions");
  if (!stored) return "new";
  
  try {
    const submissions = JSON.parse(stored);
    // Trusted if user has submitted 5+ questions
    return submissions.length >= 5 ? "trusted" : "new";
  } catch {
    return "new";
  }
}