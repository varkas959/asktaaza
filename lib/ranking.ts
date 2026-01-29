import { questions } from "./schema";

/**
 * Calculate freshness score using exponential decay
 * Score = e^(-days_old / 30)
 * Recent questions get higher scores, questions older than 60 days have minimal visibility
 */
export function calculateFreshnessScore(createdAt: Date): number {
  const now = new Date();
  const daysOld = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const decayFactor = Math.exp(-daysOld / 30);
  return Math.max(decayFactor, 0); // Ensure non-negative
}

/**
 * Calculate quality multiplier based on metadata completeness
 * Questions with complete metadata (all fields filled) get 1.1x multiplier
 */
export function calculateQualityMultiplier(question: {
  skill: string | null;
  category: string | null;
  experienceLevel: string | null;
}): number {
  let multiplier = 1.0;
  
  // Check if optional fields are filled
  if (question.skill && question.skill.trim() !== "") {
    multiplier += 0.05;
  }
  
  if (question.category && question.category.trim() !== "") {
    multiplier += 0.05;
  }
  
  if (question.experienceLevel && question.experienceLevel.trim() !== "") {
    multiplier += 0.05;
  }
  
  return Math.min(multiplier, 1.15); // Cap at 1.15x
}

/**
 * Calculate final ranking score
 * Final Score = freshness * quality_multiplier
 */
export function calculateRankingScore(
  createdAt: Date,
  question: {
    skill: string | null;
    category: string | null;
    experienceLevel: string | null;
  }
): number {
  const freshness = calculateFreshnessScore(createdAt);
  const quality = calculateQualityMultiplier(question);
  return freshness * quality;
}

/**
 * Sort questions by ranking score (highest first)
 */
export function sortQuestionsByRank<T extends { createdAt: Date; skill: string | null; category: string | null; experienceLevel: string | null }>(
  questions: T[]
): T[] {
  return [...questions].sort((a, b) => {
    const scoreA = calculateRankingScore(a.createdAt, a);
    const scoreB = calculateRankingScore(b.createdAt, b);
    return scoreB - scoreA; // Descending order
  });
}