import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/auth/",
          // Disallow filter/search pages (they have query params)
          // These will be handled by noindex meta tags in the page component
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}