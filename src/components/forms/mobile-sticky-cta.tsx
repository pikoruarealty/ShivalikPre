"use client";

import { useEffect, useState } from "react";
import { LeadButton } from "./lead-button";

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.08 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return <div className={`mobile-sticky-cta ${visible ? "is-visible" : ""}`}><LeadButton source="mobile-sticky" variant="general-enquiry">Enquire</LeadButton></div>;
}
