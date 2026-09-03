"use client";

import Link from "next/link";
import { LeadButton } from "@/components/forms/lead-button";
import { navigation } from "@/data/navigation";
import { project } from "@/data/project";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}><div className="mobile-menu-top"><span className="menu-kicker">Navigation</span><button className="menu-close" type="button" onClick={onClose} tabIndex={open ? 0 : -1} aria-label="Close navigation menu"><span aria-hidden="true">×</span></button></div><nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map((item, index) => <Link key={item.href} href={item.href} className="mobile-nav-link" tabIndex={open ? 0 : -1} onClick={onClose}><span>0{index + 1}</span>{item.label}</Link>)}<LeadButton className="mobile-nav-link" source="mobile-menu" variant="general-enquiry" tabIndex={open ? 0 : -1} onClick={onClose}><span>06</span>Enquire</LeadButton></nav><div className="mobile-menu-footer"><LeadButton source="mobile-menu" variant="private-presentation" buttonVariant="text" onClick={onClose}>Request a Private Presentation</LeadButton><span>{project.location}</span></div></div>;
}
