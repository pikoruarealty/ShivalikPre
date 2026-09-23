export type ConversionEvent = "page_view" | "lead_modal_open" | "lead_modal_close" | "lead_form_start" | "lead_form_submit" | "lead_form_success" | "lead_form_error" | "lead_otp_sent" | "lead_otp_verified" | "cta_click" | "whatsapp_click" | "phone_click" | "brochure_request" | "floor_plan_request" | "factsheet_download" | "site_visit_request" | "map_directions_click";

export function trackEvent(name: ConversionEvent, data: Record<string, string | boolean | undefined> = {}) {
  const analyticsWindow = typeof window === "undefined" ? undefined : window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (command: string, event: string, data: Record<string, string | boolean | undefined>) => void;
  };
  if (typeof analyticsWindow?.gtag === "function") analyticsWindow.gtag("event", name, data);
  else analyticsWindow?.dataLayer?.push({ event: name, ...data });
}
