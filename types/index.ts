import { questions, users } from "@/lib/schema";

export type Question = typeof questions.$inferSelect;
export type User = typeof users.$inferSelect;

export type QuestionWithUser = Question & {
  user: User;
};

export type { QuestionSubmission, QuestionFilter } from "@/lib/validation";