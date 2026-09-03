"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useLeadModal } from "./lead-provider";
import type { LeadVariant } from "@/lib/leads";
import { trackEvent } from "@/lib/analytics";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { source: string; variant?: LeadVariant; buttonVariant?: "primary" | "text"; children: ReactNode };

export function LeadButton({ source, variant = "general-enquiry", buttonVariant = "primary", className = "", children, onClick, ...props }: Props) {
  const { openLeadModal } = useLeadModal();
  return <button type="button" className={`button button-${buttonVariant} lead-button ${className}`.trim()} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) { trackEvent("cta_click", { source, variant }); openLeadModal(source, variant); } }} {...props}>{children}</button>;
}
