import Link from "next/link";
import { Container } from "@/components/layout/container";
import { insights } from "@/data/seo";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";

const articleImages = ["/images/presente/location/gift-city-skyline.jpeg", "/images/presente/interiors/riverfront-balcony.jpeg", "/images/presente/architecture/three-expressions.png"];
const latestInsights = [...insights].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate)).slice(0, 3);

export function BlogPreview() {
  return <section id="insights" className="blog-preview-section" aria-labelledby="insights-title"><Container><div className="blog-preview-heading"><div><SectionLabel>18 / Journal</SectionLabel><h2 id="insights-title" className="section-heading">Notes for a<br /><em>considered decision.</em></h2></div><Link className="blog-all-link" href="/insights">View all insights <span aria-hidden="true">↗</span></Link></div><div className="blog-preview-grid">{latestInsights.map((article, index) => <article className="blog-preview-card" key={article.slug}><Link className="blog-preview-image" href={`/insights/${article.slug}`} aria-label={`Read ${article.title}`}><ImageFrame src={articleImages[index]} className="blog-preview-visual" aria-label="" /></Link><p>{article.category}<span>·</span>{article.publishedDate}</p><h3><Link href={`/insights/${article.slug}`}>{article.title}</Link></h3><Link className="blog-read-link" href={`/insights/${article.slug}`}>Read article <span aria-hidden="true">→</span></Link></article>)}</div></Container></section>;
}
