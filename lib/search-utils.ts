/**
 * Highlight search keywords in text
 */
export function highlightKeywords(text: string, searchQuery: string): string {
  if (!searchQuery || !text) return text;

  const query = searchQuery.trim();
  if (!query) return text;

  // Split search query into individual words
  const keywords = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")); // Escape special regex characters

  if (keywords.length === 0) return text;

  // Create regex pattern that matches any of the keywords (case-insensitive)
  const pattern = new RegExp(`(${keywords.join("|")})`, "gi");

  // Replace matches with highlighted version
  return text.replace(pattern, '<mark class="bg-yellow-200 font-medium">$1</mark>');
}

/**
 * Check if text contains search query (case-insensitive)
 */
export function matchesSearch(text: string | null | undefined, searchQuery: string): boolean {
  if (!text || !searchQuery) return false;
  const query = searchQuery.trim().toLowerCase();
  if (!query) return false;
  return text.toLowerCase().includes(query);
}
