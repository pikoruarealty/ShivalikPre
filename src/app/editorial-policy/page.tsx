import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs, JsonLd } from "@/components/seo/seo-ui";
import { editorial } from "@/data/editorial";
import { breadcrumbSchema, createPageMetadata, siteUrl } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Editorial & Fact-Checking Policy",
  description: "Learn how Shivalik Présenté property guides are sourced, fact-checked, reviewed, updated and corrected for GIFT City and Gandhinagar buyers.",
  path: editorial.policyPath,
});

export default function EditorialPolicyPage() {
  const crumbs = [{ href: "/", label: "Home" }, { href: editorial.policyPath, label: "Editorial Policy" }];
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="seo-page">
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: "Editorial and fact-checking policy", url: `${siteUrl}${editorial.policyPath}`, dateModified: "2026-09-20" }, breadcrumbSchema(crumbs)] }} />
        <div className="seo-wrap">
          <Breadcrumbs items={crumbs} />
          <header className="seo-hero">
            <p className="section-label">Editorial standards</p>
            <h1>Useful guidance starts with clear sources.</h1>
            <p>Our guides separate published project facts, third-party observations and general buyer education so readers can see what needs independent confirmation.</p>
          </header>
          <div className="seo-content">
            <section><h2>Author and review roles</h2><p><strong>{editorial.authorName}</strong> prepares the buyer guides. <strong>{editorial.reviewerName}</strong> checks dated claims, source links, measurement labels and risk disclosures before material updates are published.</p></section>
            <section><h2>Source hierarchy</h2><p>We prefer official developer material and statutory records. Government and regulator sources support legal or financial context. Property portals are treated as secondary discovery sources because availability, area labels and asking prices may be inconsistent.</p></section>
            <section><h2>Corrections and updates</h2><p>Material claims carry published or updated dates. If a reliable source changes, the relevant page is reviewed and corrected. Readers should still request current, unit-specific documents before making a payment.</p></section>
            <section><h2>Commercial boundaries</h2><p>Content is general information, not legal, tax, financial or guaranteed-return advice. See the <Link href="/disclaimer">website disclaimer</Link> and <Link href="/project-facts">dated project facts</Link>.</p></section>
          </div>
        </div>
      </main>
    </>
  );
}
