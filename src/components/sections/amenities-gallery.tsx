import { LeadButton } from "@/components/forms/lead-button";
import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function AmenitiesGallery() {
  const images = ["/images/presente/amenities/private-wellness-pool.png", "/images/presente/interiors/private-lift-foyer.png", "/images/presente/interiors/riverfront-balcony.jpeg", "/images/presente/exterior/presente-exterior.jpeg", "/images/presente/location/gift-city-skyline.jpeg", "/images/presente/exterior/riverfront-tower.jpeg"];
  return <section id="amenities-gallery" className="amenities-section amenities-gallery" aria-labelledby="gallery-title"><Container><div className="gallery-heading"><SectionLabel>17 / Amenities Gallery</SectionLabel><h2 id="gallery-title" className="section-heading">An experience<br /><em>in full.</em></h2></div><div className="gallery-grid">{project.amenities.gallery.map((item, index) => <figure className={`gallery-item ${item.className}`} key={item.className}><ImageFrame src={images[index]} className="gallery-visual" aria-label={`${item.label} at Shivalik Présenté`} /><figcaption><span>{item.label}</span><strong>{item.caption}</strong></figcaption></figure>)}</div><div className="gallery-cta"><LeadButton source="amenities" variant="private-presentation" buttonVariant="text">Request a Private Presentation</LeadButton></div></Container></section>;
}
