"use client";

import { useEffect, useRef } from "react";
import { LeadButton } from "@/components/forms/lead-button";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/ui/image-frame";
import { SectionLabel } from "@/components/ui/section-label";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { project } from "@/data/project";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(Math.max(window.scrollY / (hero.offsetHeight * .68), 0), 1);
      hero.style.setProperty("--hero-scroll", progress.toString());
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero" aria-labelledby="hero-title">
      <ImageFrame src="/images/presente/interiors/riverfront-balcony.jpeg" className="hero-visual" aria-label="Riverfront balcony at Shivalik Présenté" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-inner container">
        <div className="hero-copy">
          <SectionLabel>{project.displayName}</SectionLabel>
          <h1 id="hero-title" className="display-heading">
            <span className="hero-line"><span>A Gift</span></span>
            <span className="hero-line"><span>of <em>True</em> Refinement.</span></span>
          </h1>
          <p className="hero-description">A boutique collection of {project.residenceCounts.total} ultra-luxury riverfront residences in GIFT City.</p>
          <div className="hero-actions"><Button href="#introduction">{project.cta.primary}</Button><LeadButton source="hero-private-presentation" variant="private-presentation" buttonVariant="text">{project.cta.enquiry}</LeadButton></div>
        </div>
        <div className="hero-location"><span>GIFT City</span><span aria-hidden="true">·</span><span>Gandhinagar</span></div>
        <ScrollIndicator />
      </div>
    </section>
  );
}
