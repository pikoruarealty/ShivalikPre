import Image from "next/image";
import { LeadButton } from "@/components/forms/lead-button";
import { FooterLinks } from "@/components/seo/footer-links";
import { Container } from "./container";
import { project } from "@/data/project";

export function SiteFooter() {
  return (
    <footer id="enquire" className="site-footer">
      <Container>
        <div className="footer-inner">
          <div><Image className="footer-brand-logo" src="/images/presente/brand/presented-wordmark.png" alt="Presented" width={900} height={300} /><p className="footer-location">GIFT City · Gandhinagar</p><div className="footer-contact"><a href={`tel:${project.contact.phone.replace(/\s/g, "")}`}>{project.contact.phone}</a><a href={`https://wa.me/${project.contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={`mailto:${project.contact.email}`}>{project.contact.email}</a></div></div>
          <div className="footer-closing"><p>A residence<br />in <em>presence.</em></p><LeadButton className="footer-enquire" source="footer" variant="general-enquiry" buttonVariant="text">Begin a conversation</LeadButton></div>
        </div>
        <FooterLinks />
      </Container>
    </footer>
  );
}
