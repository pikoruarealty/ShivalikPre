"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LeadButton } from "@/components/forms/lead-button";
import { navigation } from "@/data/navigation";
import { project } from "@/data/project";
import { trackEvent } from "@/lib/analytics";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) closeButton.current?.focus();
  }, [open]);

  return <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}><div className="mobile-menu-top"><span className="menu-kicker">Navigation</span><button ref={closeButton} className="menu-close" type="button" onClick={onClose} tabIndex={open ? 0 : -1} aria-label="Close navigation menu"><span aria-hidden="true">×</span></button></div><nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map((item, index) => <Link key={item.href} href={item.href} className="mobile-nav-link" tabIndex={open ? 0 : -1} onClick={onClose}><span>0{index + 1}</span>{item.label}</Link>)}<LeadButton className="mobile-nav-link" source="mobile-menu" variant="general-enquiry" tabIndex={open ? 0 : -1} onClick={onClose}><span>06</span>Enquire</LeadButton></nav><div className="mobile-menu-footer"><a href={`https://wa.me/${project.contact.whatsapp}`} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} onClick={() => trackEvent("whatsapp_click", { source: "mobile-menu" })}>WhatsApp {project.contact.phone}</a><a href={`mailto:${project.contact.email}`} tabIndex={open ? 0 : -1} onClick={() => trackEvent("cta_click", { source: "mobile-menu-email" })}>{project.contact.email}</a><LeadButton source="mobile-menu" variant="private-presentation" buttonVariant="text" tabIndex={open ? 0 : -1} onClick={onClose}>Request a Private Presentation</LeadButton><span>{project.location}</span></div></div>;
}
