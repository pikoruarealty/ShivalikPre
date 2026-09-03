import { Container } from "@/components/layout/container";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { project } from "@/data/project";

export function TowersSection() {
  return (
    <section id="expressions" className="story-section towers-section" aria-labelledby="expressions-title"><Container className="towers-grid"><div className="towers-intro"><SectionLabel>05 / Three Expressions</SectionLabel><h2 id="expressions-title" className="section-heading">Three expressions.<br /><em>One presence.</em></h2><p>{project.editorial.towers}</p></div><figure className="tower-figure"><ImageFrame src="/images/presente/architecture/three-expressions.png" className="tower-hero-visual" aria-label="Three architectural expressions of Shivalik Présenté" /><figcaption>A family of individually composed forms.</figcaption></figure><div className="tower-list">{project.towers.map((tower, index) => <article className="tower-item" key={tower}><span>0{index + 1}</span><h3>{tower}</h3></article>)}</div></Container></section>
  );
}
