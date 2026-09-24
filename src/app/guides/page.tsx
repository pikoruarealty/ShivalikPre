import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs, JsonLd, SeoCta } from "@/components/seo/seo-ui";
import { seoPages } from "@/data/seo";
import { createPageMetadata, guidesSchema } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "GIFT City & Gandhinagar Property Guides",
  description: "Explore buyer guides for luxury apartments, 4 BHK homes, duplex penthouses and residential property in GIFT City and Gandhinagar.",
  path: "/guides",
});

const guideSlugs = {
  "GIFT City property": ["luxury-apartments-gift-city", "property-in-gift-city", "gift-city-real-estate-investment", "gift-city-for-nri-buyers"],
  "Homes and configurations": ["4-bhk-apartments-gift-city", "6-bhk-penthouse-gift-city", "riverfront-apartments-gift-city"],
  "Gandhinagar and nearby": ["luxury-apartments-gandhinagar", "4-bhk-apartments-gandhinagar", "premium-apartments-near-ifsc-gift-city"],
} as const;

const indexableGuides = Object.values(guideSlugs).flatMap((slugs) =>
  slugs.map((slug) => seoPages.find((page) => page.slug === slug)).filter((page): page is NonNullable<typeof page> => Boolean(page)),
);

export default function GuidesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="seo-page guide-index-page">
        <JsonLd data={guidesSchema(indexableGuides)} />
        <div className="seo-wrap">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/guides", label: "Property Guides" }]} />
          <header className="seo-hero">
            <p className="section-label">Buyer Resource Library</p>
            <h1>Property guides for GIFT City and Gandhinagar.</h1>
            <p>Start with your location, home format or buying objective. Each guide explains what to compare, which claims to verify and where Shivalik Présenté fits without treating marketing language as evidence.</p>
          </header>

          <nav className="guide-index-nav" aria-label="Guide topics">
            {Object.keys(guideSlugs).map((group) => <a key={group} href={`#${group.toLowerCase().replaceAll(" ", "-")}`}>{group}</a>)}
          </nav>

          <div className="guide-groups">
            {Object.entries(guideSlugs).map(([group, slugs]) => (
              <section id={group.toLowerCase().replaceAll(" ", "-")} key={group} className="guide-group">
                <div className="guide-group-heading">
                  <p className="section-label">Guide collection</p>
                  <h2>{group}</h2>
                </div>
                <div className="guide-card-grid">
                  {slugs.map((slug, index) => {
                    const page = seoPages.find((item) => item.slug === slug);
                    if (!page) return null;
                    return (
                      <article key={page.slug}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <h3><Link href={`/${page.slug}`}>{page.h1}</Link></h3>
                        <p>{page.intro}</p>
                        <Link href={`/${page.slug}`} aria-label={`Read guide: ${page.h1}`}>Read guide <i aria-hidden="true">→</i></Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <SeoCta source="guides-index" label="Request Current Project Details" variant="project-details" />
        </div>
      </main>
    </>
  );
}
