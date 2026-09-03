import { Container } from "@/components/layout/container";
import { LeadButton } from "@/components/forms/lead-button";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function FourBhkSection() {
  const residence = project.residences.fourBhk;
  return <section id="four-bhk" className="residential-section four-bhk-section" aria-labelledby="four-bhk-title"><Container className="configuration-grid"><figure className="configuration-figure"><ImageFrame src="/images/presente/exterior/presente-exterior.jpeg" className="story-visual residence-visual" aria-label="Shivalik Présenté residences exterior" /><figcaption>01 / 4 BHK Residences</figcaption></figure><div className="configuration-copy"><SectionLabel>{residence.label}</SectionLabel><h2 id="four-bhk-title" className="section-heading">Designed<br /><em>around space.</em></h2><p>{residence.description}</p><div className="size-display"><span>{residence.sizeRange}</span></div><ul className="quiet-features">{residence.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><LeadButton source="four-bhk-floor-plan" variant="project-details" buttonVariant="text">Request Floor Plan</LeadButton></div></Container></section>;
}
