import "server-only";

const optional = (value: string | undefined) => value?.trim() || null;

export const serverConfig = {
  supabaseUrl: optional(process.env.SUPABASE_URL),
  supabaseSecretKey:
    optional(process.env.SUPABASE_SECRET_KEY) ??
    optional(process.env.SUPABASE_SERVICE_ROLE_KEY),
  micrositeJobId: optional(process.env.MICROSITE_JOB_ID) ?? "shivalik-presente-website",
  leadMicrositeName: optional(process.env.LEAD_MICROSITE_NAME) ?? "shivalik-presente",
  brevoApiKey: optional(process.env.BREVO_API_KEY),
  brevoSenderEmail: optional(process.env.BREVO_SENDER_EMAIL),
  brevoSenderName: optional(process.env.BREVO_SENDER_NAME) ?? "Shivalik Présenté Website",
  leadAdminEmail: optional(process.env.LEAD_ADMIN_EMAIL) ?? "luxuryrealestateahmedabad@gmail.com",
  twoFactorApiKey: optional(process.env.TWO_FACTOR_API_KEY),
  otpSessionSecret: optional(process.env.OTP_SESSION_SECRET),
} as const;
