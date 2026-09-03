import { LeadButton } from "@/components/forms/lead-button";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

export function LocationCtaSection() {
  return <section id="location-cta" className="location-section location-cta-section" aria-labelledby="location-cta-title"><Container className="location-cta-inner"><div><SectionLabel>Private Presentation</SectionLabel><h2 id="location-cta-title" className="section-heading">Experience<br /><em>Présenté in detail.</em></h2></div><div className="location-cta-copy"><p>Request project details, residence options and location information from our advisory team.</p><div className="location-cta-actions"><LeadButton source="location" variant="private-presentation">Request a Private Presentation</LeadButton><Button href="#residences" variant="text">Explore Residences</Button></div></div></Container></section>;
}
