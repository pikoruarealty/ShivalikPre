import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs, JsonLd, RelatedLinks, SeoCta } from "@/components/seo/seo-ui";
import { insights } from "@/data/seo";
import { articleSchema, createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return insights.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = insights.find((item) => item.slug === slug);
  return article
    ? createPageMetadata({
        title: article.title,
        description: article.description,
        path: `/insights/${article.slug}`,
        type: "article",
        publishedTime: article.publishedDate,
        modifiedTime: article.updatedDate,
      })
    : {};
}

const formatDate = (date: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(date));

export default async function InsightArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = insights.find((item) => item.slug === slug);
  if (!article) notFound();

  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/insights", label: "Insights" },
    { href: `/insights/${article.slug}`, label: article.title },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-page">
        <JsonLd data={articleSchema(article)} />
        <div className="seo-wrap article">
          <Breadcrumbs items={crumbs} />
          <article>
            <header className="seo-hero">
              <p className="section-label">{article.category}</p>
              <h1>{article.title}</h1>
              <p>{article.excerpt}</p>
              <p className="seo-brand-context">Shivalik Presente publishes these guides to support clearer, unit-specific decisions in GIFT City.</p>
              <p className="article-meta">
                <time dateTime={article.publishedDate}>Published {formatDate(article.publishedDate)}</time>
                {article.updatedDate !== article.publishedDate && <> · <time dateTime={article.updatedDate}>Updated {formatDate(article.updatedDate)}</time></>}
              </p>
              <p className="article-byline">
                By <Link href="/editorial-policy">{article.authorName}</Link>
                {article.reviewerName && <> · Reviewed by <Link href="/editorial-policy">{article.reviewerName}</Link></>}
              </p>
            </header>
            {article.sections.map((section) => (
              <section className="article-section" key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
            {article.sources && (
              <section className="article-section article-sources" aria-labelledby="article-sources-title">
                <h2 id="article-sources-title">Sources and verification</h2>
                <ul>
                  {article.sources.map((source) => (
                    <li key={source.href}><Link href={source.href}>{source.label}</Link></li>
                  ))}
                </ul>
              </section>
            )}
          </article>
          <SeoCta source={`blog-${article.slug}`} label="Request Project Details" />
          <RelatedLinks links={article.relatedPages} />
        </div>
      </main>
    </>
  );
}
