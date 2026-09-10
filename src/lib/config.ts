const optional = (value: string | undefined) => value?.trim() || null;

function normalizeSiteUrl(value: string | null) {
  if (!value) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

// Vercel supplies the production hostname automatically. The explicit variable
// remains the source of truth for custom domains and non-Vercel deployments.
const deploymentSiteUrl =
  optional(process.env.NEXT_PUBLIC_SITE_URL) ??
  optional(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  optional(process.env.VERCEL_URL);

export const publicConfig = {
  siteUrl: normalizeSiteUrl(deploymentSiteUrl) ?? "http://localhost:3000",
  hasProductionSiteUrl: Boolean(deploymentSiteUrl),
  phone: optional(process.env.NEXT_PUBLIC_PHONE),
  whatsapp: optional(process.env.NEXT_PUBLIC_WHATSAPP),
  email: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  ga4Id: optional(process.env.NEXT_PUBLIC_GA4_ID),
  gtmId: optional(process.env.NEXT_PUBLIC_GTM_ID),
  metaPixelId: optional(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  googleSiteVerification: optional(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
} as const;
export const serverConfig = {
  supabaseUrl: optional(process.env.SUPABASE_URL),
  supabaseServiceRoleKey: optional(process.env.SUPABASE_SERVICE_ROLE_KEY),
  brevoApiKey: optional(process.env.BREVO_API_KEY),
  brevoSenderEmail: optional(process.env.BREVO_SENDER_EMAIL),
  brevoSenderName: optional(process.env.BREVO_SENDER_NAME) ?? "Shivalik Présenté Website",
  leadAdminEmail:
    optional(process.env.LEAD_ADMIN_EMAIL) ?? "luxuryrealestateahmedabad@gmail.com",
  twoFactorApiKey: optional(process.env.TWO_FACTOR_API_KEY),
  otpSessionSecret: optional(process.env.OTP_SESSION_SECRET),
} as const;
