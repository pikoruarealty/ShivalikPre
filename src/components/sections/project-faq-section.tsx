import { Container } from "@/components/layout/container";
import { FaqList } from "@/components/seo/seo-ui";
import { projectFaqs } from "@/data/faqs";

export function ProjectFaqSection() {
  return (
    <div className="home-faq-section">
      <Container>
        <FaqList faqs={projectFaqs} />
      </Container>
    </div>
  );
}
