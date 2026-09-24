import type { Metadata } from "next";
import type { Insight, SeoPage } from "@/data/seo";
import { projectFaqs } from "@/data/faqs";
import { editorial } from "@/data/editorial";
import { fourBhkAreaLabel, projectFacts, sixBhkAreaLabel } from "@/data/project-facts";
import { publicConfig } from "@/lib/config";
export const siteUrl = publicConfig.siteUrl;
const absolute = (path: string) => new URL(path, `${siteUrl}/`).toString();
const ogImage = "/images/presente/exterior/presente-exterior-wide.jpeg";
const titleSuffix = "Shivalik Presente GIFT City";
const fullTitle = (title: string) => {
  if (title.endsWith(`| ${titleSuffix}`)) return title;
  const primaryKeyword = title.split(" | ")[0].trim();
  const brandedTitle = `${primaryKeyword} | ${titleSuffix}`;
  return brandedTitle.length <= 68 ? brandedTitle : primaryKeyword;
};

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
    authors: [{ name: editorial.authorName, url: absolute(editorial.policyPath) }],
    creator: editorial.authorName,
    publisher: "Shivalik Presente Information Website",
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

const developerId = absolute("/#developer");
const editorialId = absolute("/editorial-policy#editorial-desk");
const websiteId = absolute("/#website");
const propertyId = absolute("/#property");
const listingId = absolute("/#real-estate-listing");

const editorialOrganization = () => ({
  "@type": "Organization",
  "@id": editorialId,
  name: editorial.authorName,
  url: absolute(editorial.policyPath),
  description: editorial.description,
  logo: { "@type": "ImageObject", url: absolute("/favicon-512.png"), width: 512, height: 512 },
  email: publicConfig.email ?? undefined,
  telephone: publicConfig.phone ?? undefined,
});

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": developerId,
        name: projectFacts.developerName,
        url: "https://shivalikgroup.com/",
        sameAs: [projectFacts.sources.officialProject],
      },
      editorialOrganization(),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "Shivalik Présenté",
        alternateName: ["Présenté", "Shivalik Presente"],
        url: absolute("/"),
        description: "Ultra-luxury riverfront residences in GIFT City, Gandhinagar.",
        publisher: { "@id": editorialId },
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
        additionalProperty: [
          { "@type": "PropertyValue", name: "Developer", value: projectFacts.developerName },
          { "@type": "PropertyValue", name: "4 BHK published area", value: fourBhkAreaLabel },
          { "@type": "PropertyValue", name: "6 BHK duplex published area", value: sixBhkAreaLabel },
        ],
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Private lift foyer", value: true },
          { "@type": "LocationFeatureSpecification", name: "Riverfront-facing residences", value: true },
        ],
      },
      {
        "@type": "RealEstateListing",
        "@id": listingId,
        name: "Shivalik Presente riverfront residences in GIFT City",
        url: absolute("/"),
        description: "A listing for 4 BHK residences and limited 6 BHK duplex penthouses at Shivalik Presente in GIFT City, Gandhinagar.",
        mainEntity: { "@id": propertyId },
        publisher: { "@id": editorialId },
        inLanguage: "en-IN",
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

export function seoBreadcrumbs(page: SeoPage) {
  const topic = page.slug.includes("4-bhk")
    ? "4 BHK Apartments"
    : page.slug.includes("6-bhk") || page.slug.includes("penthouse")
      ? "6 BHK Duplex Penthouses"
      : page.slug.includes("riverfront")
        ? "Riverfront Apartments"
        : page.eyebrow === "Buyer Guide"
          ? "Buyer Guide"
          : page.h1;

  return [
    { href: "/", label: "Home" },
    { href: "/shivalik-presente-gift-city", label: "GIFT City" },
    { href: `/${page.slug}`, label: topic },
  ];
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

export function insightsSchema(articles: Insight[]) {
  const url = absolute("/insights");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: "GIFT City Property Insights",
        description: "Buyer guides about GIFT City, Gandhinagar, riverfront living and large-format residences.",
        url,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": `${url}#articles` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#articles`,
        itemListElement: articles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: article.title,
          url: absolute(`/insights/${article.slug}`),
        })),
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
        author: editorialOrganization(),
        publisher: editorialOrganization(),
        reviewedBy: article.reviewerName ? { "@type": "Organization", name: article.reviewerName, url: absolute(editorial.policyPath) } : undefined,
        isPartOf: { "@id": websiteId },
        articleSection: article.category,
        inLanguage: "en-IN",
      },
      ...(article.faqs ? [{
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }] : []),
      breadcrumbSchema([{ href: "/", label: "Home" }, { href: "/insights", label: "Insights" }, { href: `/insights/${article.slug}`, label: article.title }], `${url}#breadcrumb`),
    ],
  };
}

export function guidesSchema(pages: SeoPage[]) {
  const url = absolute("/guides");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: "GIFT City and Gandhinagar Property Guides",
        description: "A structured library of buyer guides for luxury property, large homes and residential projects in GIFT City and Gandhinagar.",
        url,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": `${url}#guides` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#guides`,
        itemListElement: pages.map((page, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: page.h1,
          url: absolute(`/${page.slug}`),
        })),
      },
      breadcrumbSchema([{ href: "/", label: "Home" }, { href: "/guides", label: "Property Guides" }], `${url}#breadcrumb`),
    ],
  };
}

export function projectFactsSchema() {
  const url = absolute("/project-facts");
  return {
    "@type": "AboutPage",
    "@id": `${url}#webpage`,
    name: "Shivalik Presente project facts",
    url,
    dateModified: projectFacts.lastReviewed,
    isPartOf: { "@id": websiteId },
    about: { "@id": propertyId },
    author: editorialOrganization(),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        { "@type": "PropertyValue", name: "Total residences", value: projectFacts.totalResidences },
        { "@type": "PropertyValue", name: "4 BHK published area", value: fourBhkAreaLabel },
        { "@type": "PropertyValue", name: "6 BHK duplex published area", value: sixBhkAreaLabel },
      ],
    },
  };
}
