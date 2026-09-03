import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function VolumeSection() {
  return (
    <section id="volume" className="residential-section volume-section" aria-labelledby="volume-title"><Container className="volume-grid"><div className="volume-value"><span>{project.volume.value}</span><small>{project.volume.unit}</small></div><div className="volume-rule" aria-hidden="true" /><div className="volume-copy"><SectionLabel>10 / The Volume</SectionLabel><h2 id="volume-title" className="section-heading">{project.volume.title}</h2><p>It is experienced vertically.</p><p className="secondary-copy">{project.volume.description}</p></div></Container></section>
  );
}
