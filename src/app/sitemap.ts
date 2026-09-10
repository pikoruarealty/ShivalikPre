import type { MetadataRoute } from "next";
import { insights, seoPages } from "@/data/seo";
import { siteUrl } from "@/lib/seo";
const contentUpdated = "2026-09-10";
export default function sitemap(): MetadataRoute.Sitemap {
  const image = `${siteUrl}/images/presente/exterior/presente-exterior-wide.jpeg`;
  return [
    { url: siteUrl, lastModified: contentUpdated, changeFrequency: "weekly", priority: 1, images: [image] },
    { url: `${siteUrl}/insights`, lastModified: contentUpdated, changeFrequency: "weekly", priority: .8, images: [image] },
    ...seoPages.map((page) => ({ url: `${siteUrl}/${page.slug}`, lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: .8, images: [image] })),
    ...insights.map((article) => ({ url: `${siteUrl}/insights/${article.slug}`, lastModified: article.updatedDate, changeFrequency: "monthly" as const, priority: .7, images: [image] })),
  ];
}
