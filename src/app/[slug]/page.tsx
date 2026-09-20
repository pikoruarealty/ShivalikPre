import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs, FaqList, JsonLd, RelatedLinks, SeoCta } from "@/components/seo/seo-ui";
import { seoPages } from "@/data/seo";
import { createPageMetadata, pageSchema, seoBreadcrumbs } from "@/lib/seo";

const redirectedPages = new Set(["shivalik-presente", "shivalik-presente-4-bhk", "shivalik-presente-penthouse", "luxury-penthouses-gift-city", "ultra-luxury-apartments-gift-city", "luxury-homes-gift-city", "luxury-apartments-for-sale-gift-city"]);
export function generateStaticParams() { return seoPages.filter((page) => !redirectedPages.has(page.slug)).map((page) => ({ slug: page.slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = seoPages.find((item) => item.slug === slug); return page ? createPageMetadata({ title: page.title, description: page.description, path: `/${page.slug}` }) : {}; }
export default async function SeoPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = seoPages.find((item) => item.slug === slug); if (!page) notFound(); const crumbs = seoBreadcrumbs(page); return <><SiteHeader /><main id="main-content" className="seo-page"><JsonLd data={pageSchema(page, `/${page.slug}`, crumbs)} /><div className="seo-wrap"><Breadcrumbs items={crumbs} /><header className="seo-hero"><p className="section-label">{page.eyebrow}</p><h1>{page.h1}</h1><p>{page.intro}</p><p className="seo-brand-context">Shivalik Presente brings this buyer context together with its limited riverfront collection in GIFT City.</p></header>{page.facts && <ul className="seo-facts">{page.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>}<div className="seo-content">{page.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div><FaqList faqs={page.faqs} /><SeoCta source={`seo-${page.slug}`} label={page.cta} variant={page.variant} /><RelatedLinks links={page.related} /></div></main></>; }
