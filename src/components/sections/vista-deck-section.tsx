import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function VistaDeckSection() {
  return (
    <section id="vista" className="story-section vista-section" aria-labelledby="vista-title"><Container className="vista-grid"><div className="vista-copy"><SectionLabel>06 / The Vista</SectionLabel><h2 id="vista-title" className="section-heading">Life extends<br /><em>beyond the glass.</em></h2><p>{project.editorial.vista}</p><p className="secondary-copy">An outdoor extension designed for changing light, open skies and everyday pause.</p></div><ImageFrame src="/images/presente/gallery/riverfront-balcony-wide.jpeg" className="story-visual vista-visual" aria-label="Floating riverfront vista deck at Shivalik Présenté" /></Container></section>
  );
}
