import type { MetadataRoute } from "next";
import { insights, seoPages } from "@/data/seo";
import { siteUrl } from "@/lib/seo";
const contentUpdated = "2026-09-20";
const redirectedPages = new Set(["shivalik-presente", "shivalik-presente-4-bhk", "shivalik-presente-penthouse", "luxury-penthouses-gift-city", "ultra-luxury-apartments-gift-city", "luxury-homes-gift-city", "luxury-apartments-for-sale-gift-city"]);
export default function sitemap(): MetadataRoute.Sitemap {
  const image = `${siteUrl}/images/presente/exterior/presente-exterior-wide.jpeg`;
  return [
    { url: siteUrl, lastModified: contentUpdated, changeFrequency: "weekly", priority: 1, images: [image] },
    { url: `${siteUrl}/insights`, lastModified: contentUpdated, changeFrequency: "weekly", priority: .8, images: [image] },
    { url: `${siteUrl}/project-facts`, lastModified: contentUpdated, changeFrequency: "monthly", priority: .8, images: [image] },
    { url: `${siteUrl}/editorial-policy`, lastModified: contentUpdated, changeFrequency: "yearly", priority: .4 },
    ...seoPages.filter((page) => !redirectedPages.has(page.slug)).map((page) => ({ url: `${siteUrl}/${page.slug}`, lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: .8, images: [image] })),
    ...insights.map((article) => ({ url: `${siteUrl}/insights/${article.slug}`, lastModified: article.updatedDate, changeFrequency: "monthly" as const, priority: .7, images: [image] })),
  ];
}
