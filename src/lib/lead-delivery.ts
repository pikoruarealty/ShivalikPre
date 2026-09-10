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
  return Boolean(
    serverConfig.brevoApiKey &&
      serverConfig.brevoSenderEmail &&
      serverConfig.leadAdminEmail,
  );
}

const escapeHtml = (value: string | undefined) =>
  (value ?? "Not provided")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const fieldRows = (lead: StoredLead) => {
  const fields: Array<[string, string | undefined]> = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Requirement", lead.requirement],
    ["Source", lead.source],
    ["Enquiry type", lead.variant],
    ["Page", lead.pathname],
    ["UTM source", lead.utm_source],
    ["UTM medium", lead.utm_medium],
    ["UTM campaign", lead.utm_campaign],
    ["Submitted at", lead.created_at],
  ];

  return fields
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e6e1d8;color:#6f6b64;font-size:12px">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e6e1d8;color:#171715;font-size:14px">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
};

type BrevoMessage = {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  textContent: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
};

async function sendBrevoEmail(message: BrevoMessage) {
  const { brevoApiKey, brevoSenderEmail, brevoSenderName } = serverConfig;
  if (!brevoApiKey || !brevoSenderEmail) throw new Error("Brevo is not configured");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": brevoApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: brevoSenderEmail, name: brevoSenderName },
      ...message,
    }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    const details = (await response.text()).slice(0, 300);
    throw new Error(
      `Brevo email failed: ${response.status}${details ? ` ${details}` : ""}`,
    );
  }
}

export async function saveLead(input: LeadInput): Promise<StoredLead> {
  const { supabaseUrl, supabaseServiceRoleKey } = serverConfig;
  if (!supabaseUrl || !supabaseServiceRoleKey) throw new Error("Supabase is not configured");

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/leads`,
    {
      method: "POST",
      headers: {
        apikey: supabaseServiceRoleKey,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(8_000),
    },
  );

  if (!response.ok) throw new Error(`Supabase lead insert failed: ${response.status}`);
  const rows = (await response.json()) as StoredLead[];
  if (!rows[0]?.id) throw new Error("Supabase did not return the saved lead");
  return rows[0];
}

export async function sendLeadNotification(lead: StoredLead) {
  const { leadAdminEmail } = serverConfig;
  if (!leadAdminEmail || !lead.email) {
    throw new Error("Brevo recipients are not configured");
  }

  const adminText = [
    "New Shivalik Présenté website lead",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Requirement: ${lead.requirement ?? "Not provided"}`,
    `Source: ${lead.source}`,
    `Enquiry type: ${lead.variant}`,
    `Page: ${lead.pathname ?? "Not provided"}`,
    `Submitted at: ${lead.created_at}`,
  ].join("\n");

  const clientText = [
    `Dear ${lead.name},`,
    "",
    "Thank you for your interest in Shivalik Présenté.",
    "We have received your enquiry. Our advisory team will contact you shortly with the requested project details.",
    "",
    `Requirement: ${lead.requirement ?? "Luxury residence"}`,
    "",
    "Warm regards,",
    "Shivalik Présenté",
  ].join("\n");

  const messages: Array<{ label: string; request: Promise<void> }> = [
    {
      label: "admin",
      request: sendBrevoEmail({
        to: [{ email: leadAdminEmail, name: "Shivalik Présenté Sales" }],
        replyTo: { email: lead.email, name: lead.name },
        subject: `New ${lead.variant} lead — ${lead.name}`,
        textContent: adminText,
        htmlContent: `<main style="max-width:640px;margin:auto;padding:28px;background:#faf8f3;font-family:Arial,sans-serif"><p style="margin:0 0 8px;color:#8f4d46;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase">New website enquiry</p><h1 style="margin:0 0 22px;color:#171715;font-size:28px;font-weight:500">${escapeHtml(lead.name)}</h1><table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#fff">${fieldRows(lead)}</table></main>`,
      }),
    },
    {
      label: "client",
      request: sendBrevoEmail({
        to: [{ email: lead.email, name: lead.name }],
        replyTo: { email: leadAdminEmail, name: "Shivalik Présenté" },
        subject: "Thank you for your interest in Shivalik Présenté",
        textContent: clientText,
        htmlContent: `<main style="max-width:640px;margin:auto;padding:36px;background:#f7f4ef;font-family:Arial,sans-serif;color:#171715"><p style="margin:0 0 10px;color:#a34f46;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Shivalik Présenté</p><h1 style="margin:0 0 22px;font-size:30px;font-weight:500">Thank you, ${escapeHtml(lead.name)}</h1><p style="margin:0 0 16px;color:#595650;font-size:16px;line-height:1.7">We have received your enquiry. Our advisory team will contact you shortly with the requested project details.</p><div style="margin:24px 0;padding:18px;border:1px solid #ddd5cb;background:#ffffff"><p style="margin:0;color:#77716a;font-size:12px;text-transform:uppercase;letter-spacing:1px">Your requirement</p><p style="margin:8px 0 0;font-size:16px">${escapeHtml(lead.requirement ?? "Luxury residence")}</p></div><p style="margin:28px 0 0;color:#77716a;font-size:14px;line-height:1.6">Warm regards,<br><strong style="color:#171715">Shivalik Présenté</strong></p></main>`,
      }),
    },
  ];

  const results = await Promise.allSettled(messages.map(({ request }) => request));
  const failures = results.flatMap((result, index) =>
    result.status === "rejected"
      ? [`${messages[index].label}: ${String(result.reason)}`]
      : [],
  );

  if (failures.length) throw new Error(failures.join("; "));
}
