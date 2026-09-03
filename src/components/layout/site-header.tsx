"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navigation } from "@/data/navigation";
import { Container } from "./container";
import { MobileMenu } from "./mobile-menu";
import { LeadButton } from "@/components/forms/lead-button";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
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
          <Image src="/images/presente/brand/presente-logo.svg" alt="Présenté" width={400} height={83} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LeadButton className="header-cta" source="header" variant="private-presentation" buttonVariant="text">Private Presentation</LeadButton>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen} aria-controls="mobile-navigation">
            <span /><span />
          </button>
        </div>
      </Container>
      </header>
      <div id="mobile-navigation"><MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} /></div>
    </>
  );
}
