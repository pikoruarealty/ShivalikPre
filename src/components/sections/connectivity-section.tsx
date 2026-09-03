import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function ConnectivitySection() {
  return <section id="connectivity" className="location-section connectivity-section" aria-labelledby="connectivity-title"><Container className="connectivity-grid"><div><SectionLabel>19 / Connectivity</SectionLabel><h2 id="connectivity-title" className="section-heading">Connected,<br />without <em>compromise.</em></h2></div><dl className="connectivity-list">{project.locationContext.connectivity.map((item, index) => <div key={item.name}><dt><span>0{index + 1}</span>{item.name}</dt><dd>{item.description}</dd></div>)}</dl></Container></section>;
}
