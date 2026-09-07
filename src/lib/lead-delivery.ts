import { serverConfig } from "@/lib/config";

export type StoredLead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  requirement?: string;
  source: string;
  variant: string;
  pathname?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  created_at: string;
};

type LeadInput = Omit<StoredLead, "id" | "created_at">;

export function isSupabaseConfigured() {
  return Boolean(serverConfig.supabaseUrl && serverConfig.supabaseServiceRoleKey);
}

export function isBrevoConfigured() {
  return Boolean(serverConfig.brevoApiKey && serverConfig.brevoSenderEmail && serverConfig.leadAdminEmail);
}

const escapeHtml = (value: string | undefined) => (value ?? "Not provided").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

const fieldRows = (lead: StoredLead) => {
  const fields: Array<[string, string | undefined]> = [["Name", lead.name], ["Phone", lead.phone], ["Email", lead.email], ["Requirement", lead.requirement], ["Source", lead.source], ["Enquiry type", lead.variant], ["Page", lead.pathname], ["UTM source", lead.utm_source], ["UTM medium", lead.utm_medium], ["UTM campaign", lead.utm_campaign], ["Submitted at", lead.created_at]];
  return fields.map(([label, value]) => `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e6e1d8;color:#6f6b64;font-size:12px">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e6e1d8;color:#171715;font-size:14px">${escapeHtml(value)}</td></tr>`).join("");
};

export async function saveLead(input: LeadInput): Promise<StoredLead> {
  const { supabaseUrl, supabaseServiceRoleKey } = serverConfig;
  if (!supabaseUrl || !supabaseServiceRoleKey) throw new Error("Supabase is not configured");
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/leads`, { method: "POST", headers: { apikey: supabaseServiceRoleKey, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(input), signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Supabase lead insert failed: ${response.status}`);
  const rows = (await response.json()) as StoredLead[];
  if (!rows[0]?.id) throw new Error("Supabase did not return the saved lead");
  return rows[0];
}

export async function sendLeadNotification(lead: StoredLead) {
  const { brevoApiKey, brevoSenderEmail, brevoSenderName, leadAdminEmail } = serverConfig;
  if (!brevoApiKey || !brevoSenderEmail || !leadAdminEmail) throw new Error("Brevo is not configured");
  const subject = `New ${lead.variant} lead — ${lead.name}`;
  const textContent = ["New Shivalik Présenté website lead", `Name: ${lead.name}`, `Phone: ${lead.phone}`, `Email: ${lead.email ?? "Not provided"}`, `Requirement: ${lead.requirement ?? "Not provided"}`, `Source: ${lead.source}`, `Enquiry type: ${lead.variant}`, `Page: ${lead.pathname ?? "Not provided"}`, `Submitted at: ${lead.created_at}`].join("\n");
  const response = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { accept: "application/json", "api-key": brevoApiKey, "content-type": "application/json" }, body: JSON.stringify({ sender: { email: brevoSenderEmail, name: brevoSenderName }, to: [{ email: leadAdminEmail }], subject, textContent, htmlContent: `<main style="max-width:640px;margin:auto;padding:28px;background:#faf8f3;font-family:Arial,sans-serif"><p style="margin:0 0 8px;color:#8f4d46;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase">New website enquiry</p><h1 style="margin:0 0 22px;color:#171715;font-size:28px;font-weight:500">${escapeHtml(lead.name)}</h1><table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#fff">${fieldRows(lead)}</table></main>` }), signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Brevo lead notification failed: ${response.status}`);
}
