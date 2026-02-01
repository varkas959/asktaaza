/**
 * Parse question content into a list of individual questions.
 * Splits by newlines and strips leading numbers (e.g. "1. Question text").
 * Used by QuestionCard (home) and detail pages for consistent display.
 */
export function formatQuestions(content: string): string[] {
  const lines = content.split(/\n+/).filter((line) => line.trim().length > 0);
  if (lines.length > 1) {
    return lines.map((line) => line.trim().replace(/^\d+\.\s*/, ""));
  }
  return [content.trim()];
}
