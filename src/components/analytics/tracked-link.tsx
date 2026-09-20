"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type ConversionEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: ConversionEvent;
  eventSource: string;
  children: ReactNode;
};

export function TrackedLink({ eventName, eventSource, children, onClick, ...props }: Props) {
  return <a {...props} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) trackEvent(eventName, { source: eventSource }); }}>{children}</a>;
}
