import Image from "next/image";
import { LeadButton } from "@/components/forms/lead-button";
import { FooterLinks } from "@/components/seo/footer-links";
import { Container } from "./container";
import { project } from "@/data/project";
import { TrackedLink } from "@/components/analytics/tracked-link";

export function SiteFooter() {
  return (
    <footer id="enquire" className="site-footer">
      <Container>
        <div className="footer-inner">
          <div><Image className="footer-brand-logo" src="/images/presente/brand/presented-wordmark.webp" alt="Shivalik Presente" width={900} height={300} sizes="(max-width: 800px) 180px, 240px" /><p className="footer-location">GIFT City · Gandhinagar</p><div className="footer-contact"><TrackedLink eventName="phone_click" eventSource="footer" href={`tel:${project.contact.phone.replace(/\s/g, "")}`}>{project.contact.phone}</TrackedLink><TrackedLink eventName="whatsapp_click" eventSource="footer" href={`https://wa.me/${project.contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</TrackedLink><TrackedLink eventName="cta_click" eventSource="footer-email" href={`mailto:${project.contact.email}`}>{project.contact.email}</TrackedLink></div></div>
          <div className="footer-closing"><p>A residence<br />in <em>presence.</em></p><LeadButton className="footer-enquire" source="footer" variant="general-enquiry" buttonVariant="text">Begin a conversation</LeadButton></div>
        </div>
        <FooterLinks />
      </Container>
    </footer>
  );
}
