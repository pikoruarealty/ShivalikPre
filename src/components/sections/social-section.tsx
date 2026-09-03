import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function SocialSection() {
  return <section id="social" className="amenities-section social-section" aria-labelledby="social-title"><Container><div className="social-heading"><SectionLabel>15 / Social</SectionLabel><h2 id="social-title" className="section-heading">Spaces made<br /><em>for togetherness.</em></h2></div><div className="social-layout"><figure className="social-large"><ImageFrame src="/images/presente/amenities/social-dining-lounge.png" className="story-visual social-lounge-visual" aria-label="Residents social dining lounge at Shivalik Présenté" /><figcaption>Residents Lounge</figcaption></figure><div className="social-side"><figure><ImageFrame src="/images/presente/interiors/riverfront-balcony.jpeg" className="story-visual social-dining-visual" aria-label="Private dining terrace at Shivalik Présenté" /><figcaption>Dining / Social Areas</figcaption></figure><ul className="social-list">{project.amenities.social.map((item) => <li key={item.name}>{item.name}</li>)}</ul></div></div></Container></section>;
}
