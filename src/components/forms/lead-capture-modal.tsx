"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LeadForm } from "./lead-form";
import type { LeadVariant } from "@/lib/leads";

type Props = {
  open: boolean;
  source: string;
  variant: LeadVariant;
  success: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function LeadCaptureModal({ open, source, variant, success, onClose, onSuccess }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);

  const requestCloseAfterSuccess = useCallback(() => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 360);
  }, [closing, onClose]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("modal-is-open");
    document.body.style.top = `-${scrollY}px`;

    const focusable = () => Array.from(
      dialog.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => focusable()[0]?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-is-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
      previousFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!open || !success) return;
    const timer = window.setTimeout(requestCloseAfterSuccess, 2600);
    return () => window.clearTimeout(timer);
  }, [open, requestCloseAfterSuccess, success]);

  if (!open) return null;

  return (
    <div className={`lead-modal-backdrop ${closing ? "is-closing" : ""}`}>
      <div
        className="lead-modal"
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        aria-describedby={success ? undefined : "lead-modal-description"}
      >
        <div className="lead-modal-visual" aria-hidden="true">
          <Image className="lead-modal-brand-logo" src="/images/presente/brand/presente-official-logo.webp" alt="" width={640} height={144} priority />
          <p>Riverfront residences<br />at GIFT City</p>
        </div>
        <div className="lead-modal-content">
          {success ? (
            <div className="lead-success" role="status" aria-live="polite">
              <p className="section-label">Private Presentation</p>
              <h2 id="lead-modal-title">Thank you.</h2>
              <p>Our advisory team will connect with you regarding Shivalik Présenté.</p>
              <p className="secondary-copy">Your request has been recorded.</p>
              <p className="lead-auto-close">This window will close automatically.</p>
            </div>
          ) : (
            <>
              <p className="section-label">Private Residence Enquiry</p>
              <h2 id="lead-modal-title">Request Priority Access</h2>
              <p id="lead-modal-description" className="lead-modal-description">Complete the details below to continue and receive project information from our advisory team.</p>
              <p className="site-visit-badge"><i />Site visits — by appointment only</p>
              <LeadForm source={source} variant={variant} onSuccess={onSuccess} />
              <p className="lead-benefits">Private callback <i /> Floor plan guidance <i /> Priority visit</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
