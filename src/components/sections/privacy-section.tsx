import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function PrivacySection() {
  return (
    <section id="privacy" className="story-section privacy-section" aria-labelledby="privacy-title">
      <Container className="privacy-grid">
        <div className="privacy-copy"><SectionLabel>03 / Privacy by Design</SectionLabel><h2 id="privacy-title" className="section-heading">Private<br /><em>by design.</em></h2><p>No shared walls. Private lift foyer. Only 54 residences.</p></div>
        <figure className="privacy-figure"><ImageFrame src="/images/presente/interiors/private-arrival-gallery.png" className="privacy-visual" aria-label="Private arrival gallery at Shivalik Présenté" /><figcaption>Arrival is considered a private ritual.</figcaption></figure>
        <ol className="feature-list">{project.privacyFeatures.slice(0, 3).map((feature, index) => <li key={feature}><span>0{index + 1}</span><strong>{feature}</strong><b aria-hidden="true">→</b></li>)}</ol>
      </Container>
    </section>
  );
}
