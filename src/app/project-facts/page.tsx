import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs, JsonLd } from "@/components/seo/seo-ui";
import { projectFacts, fourBhkAreaLabel, sixBhkAreaLabel } from "@/data/project-facts";
import { breadcrumbSchema, createPageMetadata, projectFactsSchema } from "@/lib/seo";
import { TrackedLink } from "@/components/analytics/tracked-link";

export const metadata = createPageMetadata({
  title: "Verified Project Facts",
  description: "Dated project facts, published area ranges, source links and verification notes for Shivalik Presente in GIFT City.",
  path: "/project-facts",
});

const reviewedDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
  new Date(projectFacts.lastReviewed),
);

const facts = [
  ["Project", projectFacts.displayName],
  ["Developer presented in source material", projectFacts.developerName],
  ["Location", projectFacts.location],
  ["Published collection", `${projectFacts.totalResidences} residences`],
  ["Published residence mix", `${projectFacts.simplexResidences} simplex residences and ${projectFacts.duplexPenthouses} duplex penthouses`],
  ["4 BHK published area", `Approximately ${fourBhkAreaLabel}`],
  ["6 BHK duplex published area", `Approximately ${sixBhkAreaLabel}`],
  ["Published internal height", projectFacts.internalHeight],
] as const;

export default function ProjectFactsPage() {
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/project-facts", label: "Project Facts" },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="seo-page">
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [projectFactsSchema(), breadcrumbSchema(crumbs)] }} />
        <div className="seo-wrap">
          <Breadcrumbs items={crumbs} />
          <header className="seo-hero">
            <p className="section-label">Source-led disclosure</p>
            <h1>Shivalik Presente project facts.</h1>
            <p>A dated reference for published project information, its source and the points that still require unit-specific confirmation.</p>
            <p className="article-meta"><time dateTime={projectFacts.lastReviewed}>Last reviewed {reviewedDate}</time></p>
            <TrackedLink className="button button-primary facts-download" eventName="factsheet_download" eventSource="project-facts" href="/downloads/shivalik-presente-project-facts.pdf" download>Download dated fact sheet</TrackedLink>
          </header>

          <dl className="project-facts-list">
            {facts.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>

          <div className="seo-content">
            <section>
              <h2>How to read the published areas</h2>
              <p>The source material labels these ranges as “RA”. This page does not reinterpret that abbreviation as carpet, built-up or saleable area. Request the exact statutory area statement, plan and definition for the residence offered.</p>
            </section>
            <section>
              <h2>Details to verify before payment</h2>
              <p>Confirm the current Gujarat RERA record, legal promoter name, sanctioned configuration, exact project address, possession commitment, parking, specifications, total consideration and availability from current official documents and independent advisers.</p>
            </section>
            <section>
              <h2>Primary sources</h2>
              <ul className="source-list">
                <li><Link href={projectFacts.sources.officialProject}>Shivalik Group — official Présenté project page</Link></li>
                <li><Link href={projectFacts.sources.officialPocketDocument}>Shivalik Group — Pocket project document</Link></li>
                <li><Link href={projectFacts.sources.gujaratRera}>Gujarat RERA — verify the current registration record</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
