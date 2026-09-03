import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function GiftCitySection() {
  const location = project.locationContext;
  return <section id="gift-city" className="location-section gift-city-section" aria-labelledby="gift-city-title"><Container className="gift-city-grid"><div className="gift-city-copy"><SectionLabel>18 / GIFT City</SectionLabel><h2 id="gift-city-title" className="section-heading">At the centre<br />of <em>what’s next.</em></h2><p>{location.summary}</p><p className="secondary-copy">{location.residentialContext}</p></div><figure className="gift-city-figure"><ImageFrame src="/images/presente/location/gift-city-skyline.jpeg" className="gift-city-visual" aria-label="GIFT City skyline" /><figcaption>GIFT City <span>Ahmedabad–Gandhinagar region</span></figcaption></figure></Container></section>;
}
