import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Breadcrumbs, JsonLd } from "@/components/seo/seo-ui";
import { insights } from "@/data/seo";
import { createPageMetadata, insightsSchema } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "GIFT City Property Insights",
  description: "Practical guides for evaluating GIFT City property, luxury apartments, riverfront residences, 4 BHK homes and duplex penthouses.",
  path: "/insights",
});

export default function InsightsPage() {
  const orderedInsights = [...insights].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
  const featured = orderedInsights[0];
  const topicGroups = [
    { title: "Buyer guides", categories: ["Buyer Guides", "Buyer FAQs"] },
    { title: "GIFT City and market", categories: ["GIFT City", "Market Updates", "Investment"] },
    { title: "Gandhinagar", categories: ["Gandhinagar"] },
    { title: "Homes, project and lifestyle", categories: ["Présenté", "Luxury Living", "Riverfront Living", "Comparisons", "NRI Guides"] },
  ].map((group) => ({ ...group, articles: orderedInsights.filter((article) => group.categories.includes(article.category)) }));

  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="seo-page">
        <JsonLd data={insightsSchema(orderedInsights)} />
        <div className="seo-wrap">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/insights", label: "Insights" }]} />
          <header className="seo-hero">
            <p className="section-label">Property Insights</p>
            <h1>GIFT City and Gandhinagar property insights.</h1>
            <p>Research-led articles about luxury apartments, large 4 BHK homes, duplex penthouses, riverfront living, location, project comparison and buyer due diligence.</p>
          </header>
          <nav className="insight-topic-nav" aria-label="Article topics">
            {topicGroups.filter((group) => group.articles.length).map((group) => (
              <a key={group.title} href={`#${group.title.toLowerCase().replaceAll(" ", "-")}`}>{group.title}</a>
            ))}
            <Link href="/guides">Property guide index</Link>
          </nav>
          <article className="insight-feature">
            <p>{featured.category}</p>
            <h2><Link href={`/insights/${featured.slug}`}>{featured.title}</Link></h2>
            <p>{featured.excerpt}</p>
            <Link href={`/insights/${featured.slug}`}>Read the guide <span aria-hidden="true">↗</span></Link>
          </article>
          <div className="insight-topic-groups">
            {topicGroups.filter((group) => group.articles.length).map((group) => (
              <section key={group.title} id={group.title.toLowerCase().replaceAll(" ", "-")} className="insight-topic-group">
                <div className="insight-topic-heading"><p className="section-label">Journal topic</p><h2>{group.title}</h2></div>
                <div className="insight-grid">
                  {group.articles.filter((item) => item.slug !== featured.slug).map((item) => (
                    <article key={item.slug}>
                      <p>{item.category} <span>·</span> <time dateTime={item.publishedDate}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(item.publishedDate))}</time></p>
                      <h3><Link href={`/insights/${item.slug}`}>{item.title}</Link></h3>
                      <p>{item.excerpt}</p>
                      <Link href={`/insights/${item.slug}`}>Read article</Link>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
