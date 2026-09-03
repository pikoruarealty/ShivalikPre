import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function RiverfrontSection() {
  return (
    <section id="riverfront" className="story-section riverfront-section" aria-labelledby="riverfront-title"><Container><figure className="riverfront-figure"><ImageFrame src="/images/presente/exterior/riverfront-tower.jpeg" className="story-visual riverfront-visual" aria-label="Riverfront view at Shivalik Présenté" /><figcaption><span>GIFT CITY · RIVERFRONT</span><span>04 / The Riverfront</span></figcaption></figure><div className="riverfront-copy"><SectionLabel>The Riverfront</SectionLabel><h2 id="riverfront-title" className="section-heading">A horizon<br /><em>of your own.</em></h2><p>{project.editorial.riverfront}</p></div></Container></section>
  );
}
