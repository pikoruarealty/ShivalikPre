"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { project } from "@/data/project";
import { trackEvent } from "@/lib/analytics";
import type { LeadVariant } from "@/lib/leads";
import { LeadCaptureModal } from "./lead-capture-modal";
import { MobileStickyCta } from "./mobile-sticky-cta";

type LeadContext = { openLeadModal: (source: string, variant?: LeadVariant) => void };
const LeadModalContext = createContext<LeadContext | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [source, setSource] = useState("auto-popup");
  const [variant, setVariant] = useState<LeadVariant>("private-presentation");
  const shown = useRef(false);
  const openLeadModal = useCallback((nextSource: string, nextVariant: LeadVariant = "general-enquiry") => {
    shown.current = true;
    setSource(nextSource);
    setVariant(nextVariant);
    setSuccess(false);
    setOpen(true);
    trackEvent("lead_modal_open", { source: nextSource, variant: nextVariant });
  }, []);
  const closeAfterSuccess = useCallback(() => {
    setOpen(false);
    trackEvent("lead_modal_close", { source, variant, reason: "submitted" });
  }, [source, variant]);
  const autoOpen = useCallback(() => {
    if (shown.current) return;
    shown.current = true;
    openLeadModal("auto-popup", "private-presentation");
  }, [openLeadModal]);
  useEffect(() => {
    const timer = window.setTimeout(autoOpen, project.leadSettings.popupDelayMs);
    return () => window.clearTimeout(timer);
  }, [autoOpen]);
  return <LeadModalContext.Provider value={{ openLeadModal }}><div id="site-shell" inert={open ? true : undefined} aria-hidden={open || undefined}>{children}</div><LeadCaptureModal key={open ? `${source}-${variant}` : "closed"} open={open} source={source} variant={variant} success={success} onClose={closeAfterSuccess} onSuccess={() => setSuccess(true)} /><MobileStickyCta /></LeadModalContext.Provider>;
}

export function useLeadModal() {
  const context = useContext(LeadModalContext);
  if (!context) throw new Error("LeadButton must be used inside LeadProvider.");
  return context;
}
