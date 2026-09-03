import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function LocationAdvantageSection() {
  return <section id="location-advantage" className="location-section address-section" aria-labelledby="address-title"><Container><div className="address-heading"><SectionLabel>20 / The Address</SectionLabel><h2 id="address-title" className="section-heading">A city built<br />around <em>ambition.</em></h2><p>GIFT City has emerged as a significant financial and business district, bringing global institutions, modern infrastructure and high-value employment into a compact urban ecosystem.</p></div><dl className="advantage-list">{project.locationContext.advantages.map((item, index) => <div key={item.title}><dt><span>0{index + 1}</span>{item.title}</dt><dd>{item.description}</dd></div>)}</dl></Container></section>;
}
