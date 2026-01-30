"use server";

import { db } from "@/lib/db";
import { interviewDetailOptions as optionsTable } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export type InterviewDetailType = "company" | "technology";

/** Get options for submit form and filters (public). */
export async function getInterviewDetailOptions(
  type: InterviewDetailType
): Promise<{ success: boolean; data?: string[]; error?: string }> {
  try {
    const rows = await db
      .select({ value: optionsTable.value })
      .from(optionsTable)
      .where(eq(optionsTable.type, type))
      .orderBy(asc(optionsTable.sortOrder), asc(optionsTable.value));
    return { success: true, data: rows.map((r) => r.value) };
  } catch (e) {
    console.error("getInterviewDetailOptions error:", e);
    return { success: false, error: "Failed to load options." };
  }
}

/** Add an option (admin only). */
export async function addInterviewDetailOption(
  type: InterviewDetailType,
  value: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return { success: false, error: "Unauthorized." };
  }
  const trimmed = value.trim();
  if (!trimmed) return { success: false, error: "Value is required." };
  try {
    await db.insert(optionsTable).values({
      type,
      value: trimmed,
      sortOrder: 0,
    });
    revalidatePath("/admin");
    revalidatePath("/submit");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("addInterviewDetailOption error:", e);
    return { success: false, error: "Failed to add option." };
  }
}

/** Remove an option by id (admin only). */
export async function removeInterviewDetailOption(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return { success: false, error: "Unauthorized." };
  }
  try {
    await db.delete(optionsTable).where(eq(optionsTable.id, id));
    revalidatePath("/admin");
    revalidatePath("/submit");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("removeInterviewDetailOption error:", e);
    return { success: false, error: "Failed to remove option." };
  }
}

/** Get full rows for admin list (admin only). */
export async function getInterviewDetailOptionsForAdmin(
  type: InterviewDetailType
): Promise<{ success: boolean; data?: { id: string; value: string }[]; error?: string }> {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return { success: false, error: "Unauthorized." };
  }
  try {
    const rows = await db
      .select({ id: optionsTable.id, value: optionsTable.value })
      .from(optionsTable)
      .where(eq(optionsTable.type, type))
      .orderBy(asc(optionsTable.sortOrder), asc(optionsTable.value));
    return { success: true, data: rows };
  } catch (e) {
    console.error("getInterviewDetailOptionsForAdmin error:", e);
    return { success: false, error: "Failed to load options." };
  }
}
