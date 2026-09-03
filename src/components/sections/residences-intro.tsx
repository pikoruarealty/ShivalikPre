import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function ResidencesIntro() {
  return (
    <section id="residences" className="residential-section residences-intro" aria-labelledby="residences-title">
      <Container className="residences-intro-grid"><div className="section-marker">07 <span>/</span> The Residences</div><div className="residences-intro-copy"><SectionLabel>The Residences</SectionLabel><h2 id="residences-title" className="section-heading">Space,<br /><em>without compromise.</em></h2><p>{project.residences.introduction}</p><p className="secondary-copy">A limited residential collection where scale is expressed with restraint.</p><div className="configuration-index"><a href="#four-bhk"><span>01</span>{project.residences.fourBhk.label}</a><a href="#penthouses"><span>02</span>{project.residences.penthouse.label}</a></div></div></Container>
    </section>
  );
}
