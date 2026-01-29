// Client-side submission rate limiting and validation

interface SubmissionRecord {
  timestamp: number;
  questionContent: string;
}

const STORAGE_KEY = "question_submissions";
const MAX_SUBMISSIONS_PER_DAY = 3;
const MIN_SECONDS_BETWEEN_SUBMISSIONS = 60;

export function checkSubmissionLimits(): {
  canSubmit: boolean;
  reason?: string;
  timeUntilNext?: number;
} {
  if (typeof window === "undefined") {
    return { canSubmit: true };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { canSubmit: true };
  }

  try {
    const submissions: SubmissionRecord[] = JSON.parse(stored);
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Filter submissions from last 24 hours
    const recentSubmissions = submissions.filter(
      (s) => s.timestamp > oneDayAgo
    );

    // Check daily limit
    if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_DAY) {
      const oldestRecent = Math.min(...recentSubmissions.map((s) => s.timestamp));
      const timeUntilReset = oldestRecent + 24 * 60 * 60 * 1000 - now;
      const hoursUntil = Math.ceil(timeUntilReset / (60 * 60 * 1000));
      return {
        canSubmit: false,
        reason: `You've reached the daily limit of ${MAX_SUBMISSIONS_PER_DAY} submissions. Please try again in ${hoursUntil} hour${hoursUntil > 1 ? "s" : ""}.`,
      };
    }

    // Check minimum time between submissions
    if (recentSubmissions.length > 0) {
      const lastSubmission = Math.max(...recentSubmissions.map((s) => s.timestamp));
      const timeSinceLast = (now - lastSubmission) / 1000;

      if (timeSinceLast < MIN_SECONDS_BETWEEN_SUBMISSIONS) {
        const secondsRemaining = Math.ceil(MIN_SECONDS_BETWEEN_SUBMISSIONS - timeSinceLast);
        return {
          canSubmit: false,
          reason: `Please wait ${secondsRemaining} second${secondsRemaining > 1 ? "s" : ""} between submissions.`,
          timeUntilNext: secondsRemaining,
        };
      }
    }

    return { canSubmit: true };
  } catch (error) {
    console.error("Error checking submission limits:", error);
    return { canSubmit: true };
  }
}

export function recordSubmission(questionContent: string): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const submissions: SubmissionRecord[] = stored ? JSON.parse(stored) : [];
    
    submissions.push({
      timestamp: Date.now(),
      questionContent: questionContent.trim().toLowerCase(),
    });

    // Keep only last 10 submissions to prevent storage bloat
    const recent = submissions.slice(-10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch (error) {
    console.error("Error recording submission:", error);
  }
}

export function checkDuplicate(questionContent: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const submissions: SubmissionRecord[] = JSON.parse(stored);
    const normalized = questionContent.trim().toLowerCase();
    
    // Check for similar questions (simple similarity check)
    const isDuplicate = submissions.some((s) => {
      const storedNormalized = s.questionContent;
      // Simple similarity: check if 80% of words match
      const storedWords = storedNormalized.split(/\s+/);
      const newWords = normalized.split(/\s+/);
      const commonWords = newWords.filter((w) => 
        storedWords.some((sw) => sw === w || (w.length > 4 && sw.includes(w)) || (sw.length > 4 && w.includes(sw)))
      );
      const similarity = commonWords.length / Math.max(newWords.length, storedWords.length);
      return similarity > 0.7;
    });

    return isDuplicate;
  } catch (error) {
    console.error("Error checking duplicate:", error);
    return false;
  }
}

export function isValidQuestion(content: string): boolean {
  const trimmed = content.trim();
  
  // Minimum meaningful length
  if (trimmed.length < 15) return false;
  
  // Check for too many repeated characters (spam pattern)
  const repeatedCharPattern = /(.)\1{10,}/;
  if (repeatedCharPattern.test(trimmed)) return false;
  
  // Check for minimum word count
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 3) return false;
  
  return true;
}