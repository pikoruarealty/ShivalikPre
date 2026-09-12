import type { Metadata } from "next";
import type { Insight, SeoPage } from "@/data/seo";
import { projectFaqs } from "@/data/faqs";
import { publicConfig } from "@/lib/config";
export const siteUrl = publicConfig.siteUrl;
const absolute = (path: string) => new URL(path, `${siteUrl}/`).toString();
const ogImage = "/images/presente/exterior/presente-exterior-wide.jpeg";
const fullTitle = (title: string) => title.includes("Shivalik Présenté") ? title : `${title} | Shivalik Présenté`;

export function createPageMetadata({
  title,
  description,
  path = "/",
  type = "website",
  index = true,
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  index?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = absolute(path);
  const image = absolute(ogImage);
  const resolvedTitle = fullTitle(title);
  return {
    title: { absolute: resolvedTitle },
    description,
    alternates: { canonical: url },
    authors: [{ name: "Shivalik Présenté", url: siteUrl }],
    creator: "Shivalik Présenté",
    publisher: "Shivalik Présenté",
    category: type === "article" ? "Real Estate" : undefined,
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      images: [{ url: image, width: 1913, height: 963, alt: "Shivalik Présenté riverfront residences in GIFT City" }],
      siteName: "Shivalik Présenté",
      locale: "en_IN",
      type,
      ...(type === "article" ? { publishedTime, modifiedTime, section: "Property Insights" } : {}),
    },
    twitter: { card: "summary_large_image", title: resolvedTitle, description, images: [image] },
    robots: {
      index,
      follow: index,
      googleBot: { index, follow: index, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

const organizationId = absolute("/#organization");
const websiteId = absolute("/#website");
const propertyId = absolute("/#property");

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Shivalik Présenté",
        url: absolute("/"),
        logo: { "@type": "ImageObject", url: absolute("/favicon-512.png"), width: 512, height: 512 },
        sameAs: ["https://shivalikgroup.com/projects/presente"],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "Shivalik Présenté",
        alternateName: ["Présenté", "Shivalik Presente"],
        url: absolute("/"),
        description: "Ultra-luxury riverfront residences in GIFT City, Gandhinagar.",
        publisher: { "@id": organizationId },
        inLanguage: "en-IN",
      },
      {
        "@type": "ApartmentComplex",
        "@id": propertyId,
        name: "Shivalik Présenté",
        alternateName: "Shivalik Presente",
        url: absolute("/"),
        image: absolute(ogImage),
        description: "A private collection of riverfront residences in GIFT City, Gandhinagar.",
        address: { "@type": "PostalAddress", addressLocality: "Gandhinagar", addressRegion: "Gujarat", addressCountry: "IN" },
        numberOfAccommodationUnits: 54,
      },
      {
        "@type": "FAQPage",
        "@id": absolute("/#faq"),
        mainEntity: projectFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function pageSchema(page: SeoPage, path: string, crumbs: { href: string; label: string }[]) {
  const pageUrl = absolute(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: page.title,
        description: page.description,
        url: pageUrl,
        isPartOf: { "@id": websiteId },
        about: { "@id": propertyId },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        inLanguage: "en-IN",
      },
      breadcrumbSchema(crumbs, `${pageUrl}#breadcrumb`),
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: page.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
      },
    ],
  };
}

export function breadcrumbSchema(items: { href: string; label: string }[], id?: string) {
  return {
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: absolute(item.href) })),
  };
}

export function insightsSchema() {
  const url = absolute("/insights");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: "GIFT City Property Insights",
        description: "Buyer guides about GIFT City, riverfront living and large-format residences.",
        url,
        isPartOf: { "@id": websiteId },
      },
      breadcrumbSchema([{ href: "/", label: "Home" }, { href: "/insights", label: "Insights" }], `${url}#breadcrumb`),
    ],
  };
}

export function articleSchema(article: Insight) {
  const url = absolute(`/insights/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.publishedDate,
        dateModified: article.updatedDate,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: { "@type": "ImageObject", url: absolute(ogImage), width: 1913, height: 963 },
        author: { "@id": organizationId },
        publisher: { "@id": organizationId },
        isPartOf: { "@id": websiteId },
        articleSection: article.category,
        inLanguage: "en-IN",
      },
      breadcrumbSchema([{ href: "/", label: "Home" }, { href: "/insights", label: "Insights" }, { href: `/insights/${article.slug}`, label: article.title }], `${url}#breadcrumb`),
    ],
  };
}
