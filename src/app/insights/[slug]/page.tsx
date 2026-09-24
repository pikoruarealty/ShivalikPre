import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs, FaqList, JsonLd, RelatedLinks, SeoCta } from "@/components/seo/seo-ui";
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
const sectionId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const readingTime = (sections: { title: string; body: string[] }[]) => {
  const words = sections.flatMap((section) => [section.title, ...section.body]).join(" ").trim().split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 220));
};

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
      <main id="main-content" tabIndex={-1} className="seo-page">
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
                <> · {readingTime(article.sections)} min read</>
              </p>
              <p className="article-byline">
                By <Link href="/editorial-policy">{article.authorName}</Link>
                {article.reviewerName && <> · Reviewed by <Link href="/editorial-policy">{article.reviewerName}</Link></>}
              </p>
            </header>
            <div className="article-body-layout">
              <nav className="article-toc" aria-label="On this page">
                <p>On this page</p>
                <ol>{article.sections.map((section) => <li key={section.title}><a href={`#${sectionId(section.title)}`}>{section.title}</a></li>)}</ol>
              </nav>
              <div className="article-body-content">
                {article.sections.map((section) => (
                  <section className="article-section" id={sectionId(section.title)} key={section.title}>
                    <h2>{section.title}</h2>
                    {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </section>
                ))}
                {article.faqs && <FaqList faqs={article.faqs} />}
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
              </div>
            </div>
          </article>
          <SeoCta source={`blog-${article.slug}`} label="Request Project Details" />
          <RelatedLinks links={article.relatedPages} />
        </div>
      </main>
    </>
  );
}
