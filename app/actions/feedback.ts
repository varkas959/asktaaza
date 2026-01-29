"use server";

import { db } from "@/lib/db";
import { feedback as feedbackTable } from "@/lib/schema";

export type FeedbackCategory = "bug" | "feature" | "question" | "general";

export type SubmitFeedbackInput = {
  category: FeedbackCategory;
  content: string;
  meta?: Record<string, unknown>;
  email?: string;
  deviceInfo?: string;
  honeypot?: string;
};

export async function submitFeedback(input: SubmitFeedbackInput): Promise<{ success: boolean; error?: string }> {
  try {
    // Spam: reject if honeypot is filled
    if (input.honeypot && String(input.honeypot).trim()) {
      return { success: true };
    }

    const content = (input.content || "").trim();
    if (!content || content.length < 10) {
      return { success: false, error: "Please provide at least 10 characters of feedback." };
    }

    if (content.length > 5000) {
      return { success: false, error: "Feedback is too long. Please keep it under 5000 characters." };
    }

    const email = input.email ? String(input.email).trim() : undefined;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    await db.insert(feedbackTable).values({
      category: input.category,
      content,
      meta: input.meta ? JSON.stringify(input.meta) : null,
      email: email || null,
      deviceInfo: input.deviceInfo || null,
    });

    return { success: true };
  } catch (e) {
    console.error("Feedback submit error:", e);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
