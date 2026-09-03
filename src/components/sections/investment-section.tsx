import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function InvestmentSection() {
  const investment = project.locationContext.investment;
  return <section id="investment" className="location-section investment-section" aria-labelledby="investment-title"><Container className="investment-grid"><div className="investment-copy"><SectionLabel>21 / Investment Perspective</SectionLabel><h2 id="investment-title" className="section-heading">A long-term<br /><em>urban story.</em></h2><p>{investment.description}</p></div><div><ul className="investment-pillars">{investment.pillars.map((pillar, index) => <li key={pillar}><span>0{index + 1}</span>{pillar}</li>)}</ul><p className="nri-note">{investment.nriNote}</p></div></Container></section>;
}
