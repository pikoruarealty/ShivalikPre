import { Container } from "@/components/layout/container";
import { LeadButton } from "@/components/forms/lead-button";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function PenthouseSection() {
  const residence = project.residences.penthouse;
  return <section id="penthouses" className="residential-section penthouse-section" aria-labelledby="penthouse-title"><Container className="configuration-grid penthouse-grid"><div className="configuration-copy"><SectionLabel>{residence.label}</SectionLabel><h2 id="penthouse-title" className="section-heading">A residence<br /><em>above the ordinary.</em></h2><p>{residence.description}</p><div className="size-display"><span>{residence.sizeRange}</span></div><LeadButton source="penthouse-private-presentation" variant="private-presentation" buttonVariant="text">Request a Private Presentation</LeadButton></div><figure className="configuration-figure"><ImageFrame src="/images/presente/exterior/presente-exterior-wide.jpeg" className="story-visual penthouse-visual" aria-label="Shivalik Présenté duplex penthouse exterior" /><figcaption>02 / Duplex Penthouses</figcaption></figure></Container></section>;
}
