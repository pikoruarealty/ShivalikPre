import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const searchAndAiCrawlers = [
  "Googlebot",
  "Googlebot-Image",
  "Google-Extended",
  "GoogleOther",
  "Google-InspectionTool",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "Yandex",
  "PetalBot",
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
];

export default function robots(): MetadataRoute.Robots {
  const publicSiteRule = {
    allow: "/",
    disallow: "/api/",
  };

  return {
    rules: [
      // The wildcard is the source of truth: every current and future crawler can
      // access public pages, while private API endpoints stay out of crawls.
      { userAgent: "*", ...publicSiteRule },
      // Keep the major search and AI crawler identities explicit for easy auditing.
      { userAgent: searchAndAiCrawlers, ...publicSiteRule },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
