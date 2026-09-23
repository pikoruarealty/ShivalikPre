import "server-only";

const optional = (value: string | undefined) => value?.trim() || null;

export const serverConfig = {
  supabaseUrl: optional(process.env.SUPABASE_URL),
  supabaseServiceRoleKey: optional(process.env.SUPABASE_SERVICE_ROLE_KEY),
  brevoApiKey: optional(process.env.BREVO_API_KEY),
  brevoSenderEmail: optional(process.env.BREVO_SENDER_EMAIL),
  brevoSenderName: optional(process.env.BREVO_SENDER_NAME) ?? "Shivalik Présenté Website",
  leadAdminEmail: optional(process.env.LEAD_ADMIN_EMAIL) ?? "luxuryrealestateahmedabad@gmail.com",
  twoFactorApiKey: optional(process.env.TWO_FACTOR_API_KEY),
  otpSessionSecret: optional(process.env.OTP_SESSION_SECRET),
} as const;
