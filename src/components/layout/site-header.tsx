"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/navigation";
import { Container } from "./container";
import { MobileMenu } from "./mobile-menu";
import { LeadButton } from "@/components/forms/lead-button";
import { trackEvent } from "@/lib/analytics";
import { project } from "@/data/project";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const closeMenu = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuToggle.current?.focus());
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      window.requestAnimationFrame(() => menuToggle.current?.focus());
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <Container className="header-inner">
        <Link className="wordmark" href="/" aria-label="Shivalik Présenté home">
          <Image
            src="/images/presente/brand/presented-wordmark.png"
            alt="Presented"
            width={900}
            height={300}
            priority
          />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-whatsapp" href={`https://wa.me/${project.contact.whatsapp}`} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { source: "header" })}>WhatsApp</a>
          <LeadButton className="header-cta" source="header" variant="private-presentation" buttonVariant="text">Private Presentation</LeadButton>
          <button ref={menuToggle} className="menu-toggle" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen} aria-controls="mobile-navigation">
            <span /><span />
          </button>
        </div>
      </Container>
      </header>
      <div id="mobile-navigation"><MobileMenu open={menuOpen} onClose={closeMenu} /></div>
    </>
  );
}
