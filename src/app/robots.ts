import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const searchAndAiCrawlers = [
  "Googlebot",
  "Googlebot-Image",
  "Google-Extended",
  "Bingbot",
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
];

export default function robots(): MetadataRoute.Robots {
  const publicSiteRule = {
    allow: "/",
    disallow: "/api/",
  };

  return {
    rules: [
      // The wildcard keeps every current and future crawler able to discover public pages.
      { userAgent: "*", ...publicSiteRule },
      // Explicit rules make the site's Google, Bing, and OpenAI access policy unambiguous.
      { userAgent: searchAndAiCrawlers, ...publicSiteRule },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
