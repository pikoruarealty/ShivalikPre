import type { MetadataRoute } from "next";
import { insights, seoPages } from "@/data/seo";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap { if (!siteUrl) return []; return [{ url: siteUrl, changeFrequency: "weekly", priority: 1 }, { url: `${siteUrl}/insights`, changeFrequency: "weekly", priority: .7 }, ...seoPages.map((page) => ({ url: `${siteUrl}/${page.slug}`, changeFrequency: "monthly" as const, priority: .8 })), ...insights.map((article) => ({ url: `${siteUrl}/insights/${article.slug}`, lastModified: article.updatedDate, changeFrequency: "monthly" as const, priority: .6 }))]; }
