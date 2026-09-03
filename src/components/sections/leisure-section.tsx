import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function LeisureSection() {
  return <section id="leisure" className="amenities-section leisure-section" aria-labelledby="leisure-title"><Container className="leisure-container"><figure className="leisure-figure"><ImageFrame src="/images/presente/amenities/private-cinema-games.png" className="story-visual leisure-visual" aria-label="Private cinema and games lounge at Shivalik Présenté" /><figcaption>14 / Leisure</figcaption></figure><div className="leisure-copy"><SectionLabel>Leisure</SectionLabel><h2 id="leisure-title" className="section-heading">Time,<br /><em>well spent.</em></h2><ul className="leisure-index">{project.amenities.leisure.map((item) => <li key={item.name}><span>{item.category}</span><strong>{item.name}</strong></li>)}</ul></div></Container></section>;
}
