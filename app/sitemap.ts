import { MetadataRoute } from "next";
import { getAllCompanies, getAllSkills, getAllExperienceLevels } from "@/app/actions/seo";
import { getQuestions } from "@/app/actions/questions";
import { generateSlug } from "@/lib/seo-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Add question pages
  try {
    const questionsResult = await getQuestions();
    if (questionsResult.success && questionsResult.data) {
      for (const question of questionsResult.data.slice(0, 1000)) {
        // Limit to 1000 most recent for performance
        const companySlug = generateSlug(question.company);
        const skillSlug = question.skill ? generateSlug(question.skill) : "general";
        const questionSlug = generateSlug(question.content.substring(0, 50));
        
        sitemap.push({
          url: `${baseUrl}/interview/${companySlug}/${skillSlug}/${questionSlug}`,
          lastModified: question.updatedAt || question.createdAt || new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.error("Error generating question sitemap:", error);
  }

  // Add company pages
  try {
    const companies = await getAllCompanies();
    for (const company of companies) {
      if (!company) continue; // Skip null/undefined companies
      const companySlug = generateSlug(company);
      sitemap.push({
        url: `${baseUrl}/interview/company/${companySlug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error("Error generating company sitemap:", error);
  }

  // Add skill pages
  try {
    const skills = await getAllSkills();
    for (const skill of skills) {
      if (!skill) continue; // Skip null/undefined skills
      const skillSlug = generateSlug(skill);
      sitemap.push({
        url: `${baseUrl}/interview/skill/${skillSlug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error("Error generating skill sitemap:", error);
  }

  // Add experience pages
  try {
    const experienceLevels = await getAllExperienceLevels();
    for (const level of experienceLevels) {
      if (!level) continue; // Skip null/undefined levels
      const experienceSlug = generateSlug(level);
      sitemap.push({
        url: `${baseUrl}/interview/experience/${experienceSlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Error generating experience sitemap:", error);
  }

  return sitemap;
}