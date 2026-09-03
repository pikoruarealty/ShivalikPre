import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function OpenSpacesSection() {
  return <section id="landscape" className="amenities-section open-spaces-section" aria-labelledby="landscape-title"><Container><div className="open-spaces-heading"><SectionLabel>16 / Open Spaces</SectionLabel><h2 id="landscape-title" className="section-heading">Room to pause,<br /><em>outside the walls.</em></h2><p>Landscaped outdoor spaces create quieter transitions between architecture, nature and everyday living.</p></div><figure className="open-spaces-figure"><ImageFrame src="/images/presente/landscape/podium-garden.png" className="story-visual landscape-visual" aria-label="Landscaped podium garden at Shivalik Présenté" /><figcaption>{project.amenities.outdoor.map((item) => <span key={item}>{item}</span>)}</figcaption></figure></Container></section>;
}
