export type LeadVariant = "private-presentation" | "brochure" | "project-details" | "general-enquiry";
export type LeadSubmission = { name: string; phone: string; email: string; requirement?: string; source: string; variant: LeadVariant; attribution: Record<string, string>; website?: string };
export function normalisePhone(value: string) { return value.replace(/[\s()-]/g, ""); }
export function getAttribution() { if (typeof window === "undefined") return {}; const search = new URLSearchParams(window.location.search); const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]; const attribution: Record<string, string> = { pathname: window.location.pathname, referrer: document.referrer }; keys.forEach((key) => { const value = search.get(key); if (value) attribution[key] = value; }); return attribution; }
export async function submitLead({ attribution, ...submission }: LeadSubmission) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...submission, ...attribution }),
    signal: AbortSignal.timeout(22_000),
  });
  const result = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !result?.ok) throw new Error(result?.error || "Lead submission failed");
  return { ok: true };
}
