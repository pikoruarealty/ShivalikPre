import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function AmenitiesIntro() {
  const { introduction } = project.amenities;
  return <section id="amenities" className="amenities-section amenities-intro" aria-labelledby="amenities-title"><Container className="amenities-intro-grid"><div className="section-marker">12 <span>/</span> The Club</div><div className="amenities-intro-copy"><SectionLabel>{introduction.label}</SectionLabel><h2 id="amenities-title" className="section-heading">Where time<br /><em>slows down.</em></h2><p>{introduction.description}</p><p className="secondary-copy">{introduction.secondary}</p></div></Container></section>;
}
