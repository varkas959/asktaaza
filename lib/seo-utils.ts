// SEO utility functions

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function generateQuestionSlug(question: string, company: string, skill?: string): string {
  // Take first 50 characters of question, add company and skill for uniqueness
  const questionPart = question
    .substring(0, 50)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
  
  const companyPart = generateSlug(company);
  const skillPart = skill ? generateSlug(skill) : "";
  
  const parts = [questionPart, companyPart];
  if (skillPart) parts.push(skillPart);
  
  return parts.join("-").substring(0, 100); // Limit total length
}

export function formatCompanySlug(company: string): string {
  return generateSlug(company);
}

export function formatSkillSlug(skill: string): string {
  return generateSlug(skill);
}

export function formatExperienceSlug(level: string): string {
  return generateSlug(level.replace(/\s+/g, "-"));
}