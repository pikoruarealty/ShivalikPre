import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function InteriorLifeSection() {
  return (
    <section id="interiors" className="residential-section interiors-section" aria-labelledby="interiors-title"><Container><div className="interiors-heading"><SectionLabel>11 / Interior Life</SectionLabel><h2 id="interiors-title" className="section-heading">Made for<br /><em>the way life unfolds.</em></h2></div><div className="interior-layout"><figure className="interior-figure interior-large"><ImageFrame src="/images/presente/interiors/riverfront-balcony.jpeg" className="story-visual interior-visual" aria-label="Riverfront living view at Shivalik Présenté" /><figcaption>Interior life, composed around your rhythm.</figcaption></figure><ol className="interior-stories">{project.interiorStories.map((story) => <li key={story.number}><span>{story.number}</span><div><h3>{story.title}</h3><p>{story.description}</p></div></li>)}</ol></div></Container></section>
  );
}
