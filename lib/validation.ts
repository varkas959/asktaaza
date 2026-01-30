import { z } from "zod";

export const questionSubmissionSchema = z.object({
  content: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(1000, "Question must be less than 1000 characters"),
  company: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  skill: z
    .string()
    .min(1, "Technology is required")
    .max(100, "Skill must be less than 100 characters"),
  category: z
    .string()
    .max(100, "Category must be less than 100 characters")
    .optional()
    .nullable(),
  interviewDate: z
    .date({
      required_error: "Interview date is required",
    })
    .max(new Date(), "Interview date cannot be in the future"),
  experienceLevel: z
    .enum(["0-2 years", "3-4 years", "4-6 years", "6-8 years", "8+ years"], {
      errorMap: () => ({
        message: "Experience level must be one of: 0-2 years, 3-4 years, 4-6 years, 6-8 years, 8+ years",
      }),
    })
    .optional()
    .nullable(),
  round: z.enum(
    ["phone", "onsite", "technical", "behavioral", "system_design", "other"],
    {
      errorMap: () => ({
        message: "Round must be one of: phone, onsite, technical, behavioral, system_design, other",
      }),
    }
  )
    .optional()
    .nullable(),
  source: z
    .enum(["direct", "other"], {
      errorMap: () => ({
        message: "Source must be 'direct' (Asked directly to me) or 'other' (Asked to another candidate)",
      }),
    })
    .optional()
    .nullable(),
  whenAsked: z.string().optional(), // For form submission, converted to interviewDate
});

export type QuestionSubmission = z.infer<typeof questionSubmissionSchema>;

export const questionFilterSchema = z.object({
  company: z.string().optional(),
  experienceLevel: z.enum(["0-2 years", "3-4 years", "4-6 years", "6-8 years", "8+ years"]).optional(),
  skill: z.string().optional(),
  round: z
    .enum(["phone", "onsite", "technical", "behavioral", "system_design", "other"])
    .optional(),
  freshness: z.enum(["Last 7 days", "Last 30 days", "Last 90 days", "All time"]).optional(),
  search: z.string().optional(), // Search query for question text, company, skill, category
});

export type QuestionFilter = z.infer<typeof questionFilterSchema>;