import { LeadButton } from "@/components/forms/lead-button";
import { FooterLinks } from "@/components/seo/footer-links";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer id="enquire" className="site-footer">
      <Container>
        <div className="footer-inner">
          <div><p className="wordmark"><span>Shivalik</span><strong>Présenté</strong></p><p className="footer-location">GIFT City · Gandhinagar</p></div>
          <div className="footer-closing"><p>A residence<br />in <em>presence.</em></p><LeadButton className="footer-enquire" source="footer" variant="general-enquiry" buttonVariant="text">Begin a conversation</LeadButton></div>
        </div>
        <FooterLinks />
      </Container>
    </footer>
  );
}
