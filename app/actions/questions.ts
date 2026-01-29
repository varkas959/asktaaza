"use server";

import { db } from "@/lib/db";
import { questions } from "@/lib/schema";
import { questionSubmissionSchema } from "@/lib/validation";
import { auth } from "@/lib/auth";
import { eq, and, desc, like, or, gte, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { QuestionFilter } from "@/lib/validation";

export async function createQuestion(data: unknown) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      error: "You must be signed in to submit a question",
      success: false,
    };
  }

  const validation = questionSubmissionSchema.safeParse(data);
  
  if (!validation.success) {
    console.error("Validation errors:", validation.error.issues);
    return {
      error: "Validation failed. Please check all required fields.",
      details: validation.error.issues,
      success: false,
    };
  }

  try {
    const { interviewDate, ...rest } = validation.data;
    
    // Ensure all required fields are present
    const questionData: any = {
      ...rest,
      round: rest.round || "other", // Default to "other" if not provided
      interviewDate: interviewDate,
      userId: session.user.id,
    };
    
    // Handle legacy role column if it exists (for backward compatibility)
    // The new schema doesn't have role, but old database might
    const newQuestion = await db
      .insert(questions)
      .values(questionData)
      .returning();

    revalidatePath("/");
    revalidatePath("/questions");

    return {
      success: true,
      data: newQuestion[0],
    };
  } catch (error: any) {
    console.error("Error creating question:", error);
    const errorMessage = error?.message || "Failed to create question. Please try again.";
    return {
      error: errorMessage,
      success: false,
      details: error?.cause ? [{ path: [], message: error.cause }] : undefined,
    };
  }
}

export async function getQuestions(filters?: QuestionFilter) {
  try {
    const conditions = [eq(questions.isFlagged, false)];

    if (filters) {
      // Search query - searches across content, company, skill, and category
      if (filters.search && filters.search.trim()) {
        const searchTerm = `%${filters.search.trim()}%`;
        conditions.push(
          or(
            like(questions.content, searchTerm),
            like(questions.company, searchTerm),
            like(questions.skill, searchTerm),
            like(questions.category, searchTerm)
          )!
        );
      }

      if (filters.company) {
        conditions.push(like(questions.company, `%${filters.company}%`));
      }

      if (filters.skill) {
        conditions.push(like(questions.skill, `%${filters.skill}%`));
      }

      if (filters.round) {
        conditions.push(eq(questions.round, filters.round));
      }

      if (filters.experienceLevel) {
        conditions.push(eq(questions.experienceLevel, filters.experienceLevel));
      }

      if (filters.freshness && filters.freshness !== "All time") {
        const now = new Date();
        let dateFrom = new Date();
        
        if (filters.freshness === "Last 7 days") {
          dateFrom.setDate(now.getDate() - 7);
        } else if (filters.freshness === "Last 30 days") {
          dateFrom.setDate(now.getDate() - 30);
        } else if (filters.freshness === "Last 90 days") {
          dateFrom.setDate(now.getDate() - 90);
        }
        
        conditions.push(gte(questions.createdAt, dateFrom));
      }
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    const results = await db
      .select()
      .from(questions)
      .where(whereClause)
      .orderBy(desc(questions.createdAt));

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      error: "Failed to fetch questions",
      success: false,
      data: [],
    };
  }
}

export async function getQuestionById(id: string) {
  try {
    const result = await db
      .select()
      .from(questions)
      .where(and(eq(questions.id, id), eq(questions.isFlagged, false)))
      .limit(1);

    if (result.length === 0) {
      return {
        error: "Question not found",
        success: false,
      };
    }

    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("Error fetching question:", error);
    return {
      error: "Failed to fetch question",
      success: false,
    };
  }
}

export async function getTrendingTopics() {
  try {
    // Get questions from the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get trending skills/technologies
    const trendingSkills = await db
      .select({
        name: questions.skill,
        count: count(),
      })
      .from(questions)
      .where(
        and(
          eq(questions.isFlagged, false),
          gte(questions.createdAt, weekAgo),
          sql`${questions.skill} IS NOT NULL AND ${questions.skill} != ''`
        )
      )
      .groupBy(questions.skill)
      .orderBy(desc(count()))
      .limit(5);

    // Get trending categories
    const trendingCategories = await db
      .select({
        name: questions.category,
        count: count(),
      })
      .from(questions)
      .where(
        and(
          eq(questions.isFlagged, false),
          gte(questions.createdAt, weekAgo),
          sql`${questions.category} IS NOT NULL AND ${questions.category} != ''`
        )
      )
      .groupBy(questions.category)
      .orderBy(desc(count()))
      .limit(5);

    // Combine and dedupe, preferring skills over categories
    const combined = new Map<string, number>();
    
    for (const skill of trendingSkills) {
      if (skill.name) {
        combined.set(skill.name, skill.count);
      }
    }
    
    for (const cat of trendingCategories) {
      if (cat.name && !combined.has(cat.name)) {
        combined.set(cat.name, cat.count);
      }
    }

    // Convert to array and sort by count
    const trending = Array.from(combined.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // If no recent data, get all-time trending
    if (trending.length === 0) {
      const allTimeSkills = await db
        .select({
          name: questions.skill,
          count: count(),
        })
        .from(questions)
        .where(
          and(
            eq(questions.isFlagged, false),
            sql`${questions.skill} IS NOT NULL AND ${questions.skill} != ''`
          )
        )
        .groupBy(questions.skill)
        .orderBy(desc(count()))
        .limit(5);

      return {
        success: true,
        data: allTimeSkills.map(s => ({
          name: s.name || "General",
          count: s.count,
          period: "all time"
        })),
      };
    }

    return {
      success: true,
      data: trending.map(t => ({
        name: t.name,
        count: t.count,
        period: "this week"
      })),
    };
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return {
      error: "Failed to fetch trending topics",
      success: false,
      data: [],
    };
  }
}

export async function getTopCompanies() {
  try {
    // Get companies with most questions
    const topCompanies = await db
      .select({
        name: questions.company,
        count: count(),
      })
      .from(questions)
      .where(eq(questions.isFlagged, false))
      .groupBy(questions.company)
      .orderBy(desc(count()))
      .limit(5);

    return {
      success: true,
      data: topCompanies.map(c => ({
        name: c.name,
        discussions: c.count,
      })),
    };
  } catch (error) {
    console.error("Error fetching top companies:", error);
    return {
      error: "Failed to fetch top companies",
      success: false,
      data: [],
    };
  }
}

// Admin emails - must match the ones in admin page
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) return false;
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(session.user.email.toLowerCase());
}

// Admin functions
export async function getAllQuestionsForAdmin() {
  if (!(await isAdmin())) {
    return {
      error: "Unauthorized",
      success: false,
      data: [],
    };
  }

  try {
    const results = await db
      .select()
      .from(questions)
      .orderBy(desc(questions.createdAt));

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Error fetching questions for admin:", error);
    return {
      error: "Failed to fetch questions",
      success: false,
      data: [],
    };
  }
}

export async function deleteQuestion(id: string) {
  if (!(await isAdmin())) {
    return {
      error: "Unauthorized",
      success: false,
    };
  }

  try {
    await db.delete(questions).where(eq(questions.id, id));
    
    revalidatePath("/");
    revalidatePath("/admin");
    
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting question:", error);
    return {
      error: "Failed to delete question",
      success: false,
    };
  }
}

export async function flagQuestion(id: string) {
  if (!(await isAdmin())) {
    return {
      error: "Unauthorized",
      success: false,
    };
  }

  try {
    await db
      .update(questions)
      .set({ isFlagged: true, updatedAt: new Date() })
      .where(eq(questions.id, id));
    
    revalidatePath("/");
    revalidatePath("/admin");
    
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error flagging question:", error);
    return {
      error: "Failed to flag question",
      success: false,
    };
  }
}

export async function approveQuestion(id: string) {
  if (!(await isAdmin())) {
    return {
      error: "Unauthorized",
      success: false,
    };
  }

  try {
    await db
      .update(questions)
      .set({ isFlagged: false, updatedAt: new Date() })
      .where(eq(questions.id, id));
    
    revalidatePath("/");
    revalidatePath("/admin");
    
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error approving question:", error);
    return {
      error: "Failed to approve question",
      success: false,
    };
  }
}