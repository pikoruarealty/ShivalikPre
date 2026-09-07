"use client";

import { useEffect, useState } from "react";
import { LeadButton } from "./lead-button";
import { project } from "@/data/project";
import { trackEvent } from "@/lib/analytics";

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.08 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return <div className={`mobile-sticky-cta ${visible ? "is-visible" : ""}`} aria-hidden={!visible}><a className="mobile-whatsapp" href={`https://wa.me/${project.contact.whatsapp}`} target="_blank" rel="noreferrer" tabIndex={visible ? 0 : -1} onClick={() => trackEvent("whatsapp_click", { source: "mobile-sticky" })}>WhatsApp</a><LeadButton source="mobile-sticky" variant="general-enquiry" tabIndex={visible ? 0 : -1}>Enquire</LeadButton></div>;
}
