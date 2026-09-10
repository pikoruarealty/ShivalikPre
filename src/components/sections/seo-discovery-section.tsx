import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";

const guides = [
  { href: "/luxury-apartments-gift-city", title: "Luxury apartments in GIFT City", description: "Compare premium residences through planning, privacy, amenities and ownership fit." },
  { href: "/ultra-luxury-apartments-gift-city", title: "Ultra-luxury apartments", description: "Understand scale, private arrival, low-density planning and residential services." },
  { href: "/4-bhk-apartments-gift-city", title: "4 BHK luxury apartments", description: "A plan-led checklist for large-format homes, usable area and family privacy." },
  { href: "/6-bhk-penthouse-gift-city", title: "6 BHK duplex penthouses", description: "Review vertical planning, top-floor exposure, views and exclusive areas." },
  { href: "/riverfront-apartments-gift-city", title: "Riverfront apartments", description: "Evaluate river views, orientation, decks, climate and the future view corridor." },
  { href: "/premium-apartments-near-ifsc-gift-city", title: "Premium homes near IFSC", description: "Test real journey times, neighbourhood context and everyday convenience." },
] as const;

export function SeoDiscoverySection() {
  return (
    <section className="seo-discovery-section" aria-labelledby="seo-discovery-title">
      <Container>
        <div className="seo-discovery-heading">
          <div>
            <SectionLabel>Explore the Collection</SectionLabel>
            <h2 id="seo-discovery-title" className="section-heading">Luxury living,<br /><em>considered clearly.</em></h2>
          </div>
          <p>Explore luxury apartments, premium homes and exclusive riverfront residences in GIFT City through focused guides created for real buyer decisions.</p>
        </div>
        <div className="seo-discovery-grid">
          {guides.map((guide, index) => (
            <article key={guide.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3><Link href={guide.href}>{guide.title}</Link></h3>
              <p>{guide.description}</p>
              <Link href={guide.href} aria-label={`Explore ${guide.title}`}>Explore guide <i aria-hidden="true">→</i></Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
