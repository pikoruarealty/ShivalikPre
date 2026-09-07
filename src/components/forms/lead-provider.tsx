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
  const mountedAt = useRef<number | undefined>(undefined);
  const openLeadModal = useCallback((nextSource: string, nextVariant: LeadVariant = "general-enquiry") => {
    // A visitor who has already opened the form should never have it replaced by
    // an automatic trigger during the same session.
    shown.current = true;
    setSource(nextSource);
    setVariant(nextVariant);
    setSuccess(false);
    setOpen(true);
    trackEvent("lead_modal_open", { source: nextSource, variant: nextVariant });
  }, []);
  const close = useCallback(() => { setOpen(false); sessionStorage.setItem(project.leadSettings.popupSessionKey, "true"); trackEvent("lead_modal_close", { source, variant }); }, [source, variant]);
  const autoOpen = useCallback((reason: "timer" | "scroll" | "exit") => { if (shown.current || sessionStorage.getItem(project.leadSettings.popupSessionKey)) return; shown.current = true; openLeadModal("auto-popup", "private-presentation"); trackEvent("lead_modal_open", { source: "auto-popup", trigger: reason }); }, [openLeadModal]);
  useEffect(() => {
    mountedAt.current = Date.now();
    const timer = window.setTimeout(() => autoOpen("timer"), project.leadSettings.popupDelayMs);
    const scroll = () => { if (document.documentElement.scrollHeight > window.innerHeight && window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) >= project.leadSettings.popupScrollThreshold) autoOpen("scroll"); };
    const exit = (event: MouseEvent) => { if (project.leadSettings.enableExitIntent && Date.now() - (mountedAt.current ?? Date.now()) >= 8000 && event.clientY <= 0 && window.innerWidth > 800) autoOpen("exit"); };
    window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("mouseout", exit);
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", scroll); window.removeEventListener("mouseout", exit); };
  }, [autoOpen]);
  return <LeadModalContext.Provider value={{ openLeadModal }}><div id="main-content" tabIndex={-1}>{children}</div><LeadCaptureModal key={open ? `${source}-${variant}` : "closed"} open={open} source={source} variant={variant} success={success} onClose={close} onSuccess={() => { setSuccess(true); sessionStorage.setItem(project.leadSettings.popupSessionKey, "true"); }} /><MobileStickyCta /></LeadModalContext.Provider>;
}

export function useLeadModal() {
  const context = useContext(LeadModalContext);
  if (!context) throw new Error("LeadButton must be used inside LeadProvider.");
  return context;
}
