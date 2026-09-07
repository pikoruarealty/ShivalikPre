const optional = (value: string | undefined) => value?.trim() || null;
export const publicConfig = { siteUrl: optional(process.env.NEXT_PUBLIC_SITE_URL), phone: optional(process.env.NEXT_PUBLIC_PHONE), whatsapp: optional(process.env.NEXT_PUBLIC_WHATSAPP), email: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL), ga4Id: optional(process.env.NEXT_PUBLIC_GA4_ID), gtmId: optional(process.env.NEXT_PUBLIC_GTM_ID), metaPixelId: optional(process.env.NEXT_PUBLIC_META_PIXEL_ID), googleSiteVerification: optional(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) } as const;
export const serverConfig = {
  supabaseUrl: optional(process.env.SUPABASE_URL),
  supabaseServiceRoleKey: optional(process.env.SUPABASE_SERVICE_ROLE_KEY),
  brevoApiKey: optional(process.env.BREVO_API_KEY),
  brevoSenderEmail: optional(process.env.BREVO_SENDER_EMAIL),
  brevoSenderName: optional(process.env.BREVO_SENDER_NAME) ?? "Shivalik Présenté Website",
  leadAdminEmail: optional(process.env.LEAD_ADMIN_EMAIL),
  twoFactorApiKey: optional(process.env.TWO_FACTOR_API_KEY),
  otpSessionSecret: optional(process.env.OTP_SESSION_SECRET),
} as const;
