import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function ProjectNumbers() {
  return (
    <section id="numbers" className="story-section numbers-section" aria-labelledby="numbers-title">
      <Container><div className="numbers-header"><SectionLabel>02 / Project Numbers</SectionLabel><h2 id="numbers-title" className="visually-hidden">A collection measured in space</h2></div><dl className="numbers-list">{project.statistics.map((stat) => <div className="number-item" key={stat.label}><dd>{stat.value}</dd><dt>{stat.label}</dt></div>)}<div className="number-item number-statement"><dd>All residences</dd><dt>Riverfront Facing</dt></div></dl></Container>
    </section>
  );
}
