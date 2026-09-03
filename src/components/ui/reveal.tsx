"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealVariant = "text" | "image" | "list" | "line";

const callbacks = new Map<Element, () => void>();
let observer: IntersectionObserver | undefined;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
  }

  return observer;
}

export function Reveal({ children, variant = "text", className = "" }: { children: ReactNode; variant?: RevealVariant; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("is-revealed");
      return;
    }

    element.classList.add("is-pending");
    const reveal = () => {
      element.classList.remove("is-pending");
      element.classList.add("is-revealed");
    };
    const frame = window.requestAnimationFrame(() => {
      callbacks.set(element, reveal);
      getObserver().observe(element);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      callbacks.delete(element);
      observer?.unobserve(element);
    };
  }, []);

  return <div ref={ref} className={`reveal reveal-${variant} ${className}`}>{children}</div>;
}
