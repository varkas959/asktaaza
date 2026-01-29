"use server";

import { db } from "@/lib/db";
import { questions } from "@/lib/schema";
import { eq, and, like, sql } from "drizzle-orm";
import { generateSlug } from "@/lib/seo-utils";

export async function getCompanyQuestions(companySlug: string) {
  try {
    // Get all companies and match by slug
    const allResults = await db
      .select()
      .from(questions)
      .where(eq(questions.isFlagged, false))
      .orderBy(sql`${questions.createdAt} DESC`);

    // Filter by matching slug
    const results = allResults.filter((q) => {
      const qSlug = generateSlug(q.company);
      return qSlug === companySlug.toLowerCase();
    }).slice(0, 50);

    // Get actual company name from first result
    const companyName = results[0]?.company || companySlug;

    return {
      success: true,
      data: results,
      companyName,
    };
  } catch (error) {
    console.error("Error fetching company questions:", error);
    return {
      success: false,
      data: [],
      companyName: companySlug,
    };
  }
}

export async function getSkillQuestions(skillSlug: string) {
  try {
    const allResults = await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.isFlagged, false),
          sql`${questions.skill} IS NOT NULL`
        )
      )
      .orderBy(sql`${questions.createdAt} DESC`);

    // Filter by matching slug
    const results = allResults.filter((q) => {
      if (!q.skill) return false;
      const qSlug = generateSlug(q.skill);
      return qSlug === skillSlug.toLowerCase();
    }).slice(0, 50);

    const skillName = results[0]?.skill || skillSlug;

    return {
      success: true,
      data: results,
      skillName,
    };
  } catch (error) {
    console.error("Error fetching skill questions:", error);
    return {
      success: false,
      data: [],
      skillName: skillSlug,
    };
  }
}

export async function getExperienceQuestions(experienceSlug: string) {
  try {
    const allResults = await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.isFlagged, false),
          sql`${questions.experienceLevel} IS NOT NULL`
        )
      )
      .orderBy(sql`${questions.createdAt} DESC`);

    // Filter by matching slug
    const results = allResults.filter((q) => {
      if (!q.experienceLevel) return false;
      const qSlug = generateSlug(q.experienceLevel);
      return qSlug === experienceSlug.toLowerCase();
    }).slice(0, 50);

    const experienceName = results[0]?.experienceLevel || experienceSlug;

    return {
      success: true,
      data: results,
      experienceName,
    };
  } catch (error) {
    console.error("Error fetching experience questions:", error);
    return {
      success: false,
      data: [],
      experienceName: experienceSlug,
    };
  }
}

export async function getQuestionBySlug(companySlug: string, skillSlug: string, questionSlug: string) {
  try {
    // Get all questions and filter by slugs
    const allResults = await db
      .select()
      .from(questions)
      .where(eq(questions.isFlagged, false))
      .orderBy(sql`${questions.createdAt} DESC`)
      .limit(100);

    // Filter by matching company and skill slugs
    const filtered = allResults.filter((q) => {
      const qCompanySlug = generateSlug(q.company);
      const qSkillSlug = q.skill ? generateSlug(q.skill) : "general";
      return qCompanySlug === companySlug.toLowerCase() && 
             (skillSlug === "general" || qSkillSlug === skillSlug.toLowerCase());
    });

    // Find best match based on question slug
    const matched = filtered.find((q) => {
      const qSlug = generateSlug(q.content.substring(0, 50));
      return qSlug.includes(questionSlug) || questionSlug.includes(qSlug);
    });

    if (matched) {
      return {
        success: true,
        data: matched,
      };
    }

    return {
      success: false,
      error: "Question not found",
    };
  } catch (error) {
    console.error("Error fetching question by slug:", error);
    return {
      success: false,
      error: "Failed to fetch question",
    };
  }
}

export async function getAllCompanies() {
  try {
    const results = await db
      .selectDistinct({ company: questions.company })
      .from(questions)
      .where(eq(questions.isFlagged, false));

    return results.map((r) => r.company).filter(Boolean);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getAllSkills() {
  try {
    const results = await db
      .selectDistinct({ skill: questions.skill })
      .from(questions)
      .where(
        and(
          eq(questions.isFlagged, false),
          sql`${questions.skill} IS NOT NULL`
        )
      );

    return results.map((r) => r.skill).filter(Boolean);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function getAllExperienceLevels() {
  try {
    const results = await db
      .selectDistinct({ experienceLevel: questions.experienceLevel })
      .from(questions)
      .where(
        and(
          eq(questions.isFlagged, false),
          sql`${questions.experienceLevel} IS NOT NULL`
        )
      );

    return results.map((r) => r.experienceLevel).filter(Boolean);
  } catch (error) {
    console.error("Error fetching experience levels:", error);
    return [];
  }
}