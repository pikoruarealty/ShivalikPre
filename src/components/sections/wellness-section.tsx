import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function WellnessSection() {
  return <section id="wellness" className="amenities-section wellness-section" aria-labelledby="wellness-title"><Container className="wellness-grid"><figure className="amenity-figure"><ImageFrame src="/images/presente/amenities/private-wellness-pool.png" className="story-visual wellness-visual" aria-label="Private wellness pool at Shivalik Présenté" /><figcaption>Water, movement, restoration.</figcaption></figure><div className="amenity-copy"><SectionLabel>13 / Wellness</SectionLabel><h2 id="wellness-title" className="section-heading">A quieter<br /><em>kind of energy.</em></h2><ol className="amenity-index">{project.amenities.wellness.map((item) => <li key={item.number}><span>{item.number}</span><div><h3>{item.name}</h3><p>{item.description}</p></div></li>)}</ol></div></Container></section>;
}
