// Bookmark management using localStorage

const BOOKMARKS_KEY = "asktaaza_bookmarks";

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(questionId: string): boolean {
  return getBookmarks().includes(questionId);
}

export function addBookmark(questionId: string): void {
  if (typeof window === "undefined") return;
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(questionId)) {
    bookmarks.push(questionId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(questionId: string): void {
  if (typeof window === "undefined") return;
  const bookmarks = getBookmarks().filter(id => id !== questionId);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function toggleBookmark(questionId: string): boolean {
  if (isBookmarked(questionId)) {
    removeBookmark(questionId);
    return false;
  } else {
    addBookmark(questionId);
    return true;
  }
}

export function getBookmarkCount(): number {
  return getBookmarks().length;
}
