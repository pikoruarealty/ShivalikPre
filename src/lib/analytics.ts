export type ConversionEvent = "page_view" | "lead_modal_open" | "lead_modal_close" | "lead_form_start" | "lead_form_submit" | "lead_form_success" | "lead_form_error" | "cta_click" | "whatsapp_click" | "phone_click" | "brochure_request" | "floor_plan_request";

export function trackEvent(name: ConversionEvent, data: Record<string, string | boolean | undefined> = {}) {
  const analyticsWindow = typeof window === "undefined" ? undefined : window as Window & { gtag?: (command: string, event: string, data: Record<string, string | boolean | undefined>) => void };
  if (typeof analyticsWindow?.gtag === "function") analyticsWindow.gtag("event", name, data);
}
