"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LeadForm } from "./lead-form";
import type { LeadVariant } from "@/lib/leads";

type Props = { open: boolean; source: string; variant: LeadVariant; success: boolean; onClose: () => void; onSuccess: () => void };

export function LeadCaptureModal({ open, source, variant, success, onClose, onSuccess }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);
  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 360);
  }, [closing, onClose]);
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("modal-is-open");
    const focusable = () => Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])') ?? []);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { requestClose(); return; }
      if (event.key === "Tab") { const items = focusable(); if (!items.length) return; const first = items[0]; const last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    };
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => focusable()[0]?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-is-open");
      previousFocus.current?.focus();
    };
  }, [open, requestClose]);
  useEffect(() => () => { if (closeTimer.current) window.clearTimeout(closeTimer.current); }, []);
  if (!open) return null;
  return <div className={`lead-modal-backdrop ${closing ? "is-closing" : ""}`} onMouseDown={(event) => { if (event.target === event.currentTarget) requestClose(); }}><div className="lead-modal" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
    <div className="lead-modal-visual" aria-hidden="true"><span>Shivalik<br /><em>Présenté</em></span></div><div className="lead-modal-content"><button className="lead-modal-close" type="button" onClick={requestClose} aria-label="Close enquiry form">×</button>{success ? <div className="lead-success" role="status" aria-live="polite"><p className="section-label">Private Presentation</p><h2 id="lead-modal-title">Thank you.</h2><p>Our advisory team will connect with you regarding Shivalik Présenté.</p><p className="secondary-copy">Your request has been recorded.</p><button type="button" className="button button-text" onClick={requestClose}>Return to the site</button></div> : <><p className="section-label">Private Residence Enquiry</p><h2 id="lead-modal-title">Request Priority Access</h2><p className="lead-modal-description">Share your requirements and receive project details from our advisory team.</p><p className="site-visit-badge"><i />Site visits — by appointment only</p><LeadForm source={source} variant={variant} onSuccess={onSuccess} /><p className="lead-benefits">Private callback <i /> Floor plan guidance <i /> Priority visit</p></>}</div>
  </div></div>;
}
