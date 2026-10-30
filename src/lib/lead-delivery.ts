import { serverConfig } from "@/lib/server-config";

export type LeadDetails = {
  leadId: string;
  jobId: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  requirement?: string;
  budget?: string;
  site: string;
  source: string;
  formSource: string;
  variant: string;
  pathname?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  verifiedAt: string;
  createdAt: string;
};

export function isSupabaseConfigured() {
  return Boolean(
    serverConfig.supabaseUrl &&
      serverConfig.supabaseSecretKey &&
      serverConfig.micrositeJobId,
  );
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

const fieldRows = (lead: LeadDetails) => {
  const fields: Array<[string, string | undefined]> = [
    ["Name", lead.name],
    ["First name", lead.firstName],
    ["Last name", lead.lastName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Requirement", lead.requirement],
    ["Budget", lead.budget],
    ["Site", lead.site],
    ["Source", lead.source],
    ["Form source", lead.formSource],
    ["Enquiry type", lead.variant],
    ["Page", lead.pathname],
    ["Referrer", lead.referrer],
    ["UTM source", lead.utm_source],
    ["UTM medium", lead.utm_medium],
    ["UTM campaign", lead.utm_campaign],
    ["UTM content", lead.utm_content],
    ["UTM term", lead.utm_term],
    ["Lead ID", lead.leadId],
    ["Verified at", lead.verifiedAt],
    ["Submitted at", lead.createdAt],
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

const databaseMessage = (lead: LeadDetails) =>
  [
    `Site: ${lead.site}`,
    `Source: ${lead.source}`,
    `Form source: ${lead.formSource}`,
    `Enquiry type: ${lead.variant}`,
    `Page: ${lead.pathname ?? "Not provided"}`,
    `Referrer: ${lead.referrer ?? "Not provided"}`,
    `UTM source: ${lead.utm_source ?? "Not provided"}`,
    `UTM medium: ${lead.utm_medium ?? "Not provided"}`,
    `UTM campaign: ${lead.utm_campaign ?? "Not provided"}`,
    `UTM content: ${lead.utm_content ?? "Not provided"}`,
    `UTM term: ${lead.utm_term ?? "Not provided"}`,
  ].join("\n");

export async function saveLead(lead: LeadDetails): Promise<void> {
  const { supabaseUrl, supabaseSecretKey, micrositeJobId } = serverConfig;
  if (!supabaseUrl || !supabaseSecretKey || !micrositeJobId) {
    throw new Error("Supabase microsite lead storage is not configured");
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/microsite_leads`,
    {
      method: "POST",
      headers: {
        apikey: supabaseSecretKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        job_id: lead.jobId,
        name: lead.name,
        first_name: lead.firstName,
        last_name: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        requirement: lead.requirement,
        budget: lead.budget,
        message: databaseMessage(lead),
        source: lead.source,
        verified_at: lead.verifiedAt,
        lead_id: lead.leadId,
        site: lead.site,
      }),
      signal: AbortSignal.timeout(8_000),
    },
  );

  if (!response.ok) {
    const details = (await response.text()).slice(0, 300);
    throw new Error(
      `Supabase microsite lead insert failed: ${response.status}${details ? ` ${details}` : ""}`,
    );
  }
}

export async function sendLeadNotification(lead: LeadDetails) {
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
    `Budget: ${lead.budget ?? "Not provided"}`,
    `Site: ${lead.site}`,
    `Source: ${lead.source}`,
    `Form source: ${lead.formSource}`,
    `Enquiry type: ${lead.variant}`,
    `Page: ${lead.pathname ?? "Not provided"}`,
    `Referrer: ${lead.referrer ?? "Not provided"}`,
    `UTM source: ${lead.utm_source ?? "Not provided"}`,
    `UTM medium: ${lead.utm_medium ?? "Not provided"}`,
    `UTM campaign: ${lead.utm_campaign ?? "Not provided"}`,
    `UTM content: ${lead.utm_content ?? "Not provided"}`,
    `UTM term: ${lead.utm_term ?? "Not provided"}`,
    `Lead ID: ${lead.leadId}`,
    `Verified at: ${lead.verifiedAt}`,
    `Submitted at: ${lead.createdAt}`,
  ].join("\n");

  const clientText = [
    `Dear ${lead.name},`,
    "",
    "Thank you for your interest in Shivalik Présenté.",
    "We have received your enquiry. Our advisory team will contact you shortly with the requested project details.",
    "",
    `Requirement: ${lead.requirement ?? "Luxury residence"}`,
    `Budget: ${lead.budget ?? "Not provided"}`,
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
