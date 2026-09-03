import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function ProjectIntroduction() {
  return (
    <section id="introduction" className="story-section presence-section" aria-labelledby="presence-title">
      <Container className="presence-grid">
        <div className="section-marker">01 <span>/</span> Beyond the Residence</div>
        <figure className="presence-figure"><ImageFrame src="/images/presente/interiors/private-lift-foyer.png" className="presence-visual" aria-label="Private lift foyer at Shivalik Présenté" /><figcaption>Private arrival, composed with care.</figcaption></figure>
        <div className="presence-copy"><SectionLabel>Beyond the Residence</SectionLabel><h2 id="presence-title" className="section-heading">Where refinement<br /><em>becomes a way of life.</em></h2><p>{project.editorial.introduction}</p><p className="secondary-copy">A residential experience created for those who value space, discretion and architectural clarity.</p></div>
      </Container>
    </section>
  );
}
