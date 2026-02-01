"use server";

import { db } from "@/lib/db";
import { feedback as feedbackTable } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { desc } from "drizzle-orm";

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

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) return false;
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(session.user.email.toLowerCase());
}

export type FeedbackRow = {
  id: string;
  category: string;
  content: string;
  meta: string | null;
  email: string | null;
  deviceInfo: string | null;
  createdAt: Date | null;
};

export async function getAllFeedbackForAdmin(): Promise<{
  success: boolean;
  data?: FeedbackRow[];
  error?: string;
}> {
  if (!(await isAdmin())) {
    return { success: false, data: [], error: "Unauthorized" };
  }
  try {
    const rows = await db
      .select()
      .from(feedbackTable)
      .orderBy(desc(feedbackTable.createdAt));
    return {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        category: r.category,
        content: r.content,
        meta: r.meta,
        email: r.email,
        deviceInfo: r.deviceInfo,
        createdAt: r.createdAt,
      })),
    };
  } catch (e) {
    console.error("getAllFeedbackForAdmin error:", e);
    return { success: false, data: [], error: "Failed to load feedback." };
  }
}
