import { createHmac, timingSafeEqual } from "node:crypto";
import { serverConfig } from "@/lib/config";

export const otpPendingCookie = "lead_otp_pending";
export const otpVerifiedCookie = "lead_otp_verified";
const ttlMs = 10 * 60 * 1000;

type PendingOtp = { phone: string; sessionId: string; expiresAt: number };
type VerifiedOtp = { phone: string; expiresAt: number };

const sign = (value: string) => createHmac("sha256", serverConfig.otpSessionSecret ?? "").update(value).digest("base64url");
const encode = (value: object) => { const payload = Buffer.from(JSON.stringify(value)).toString("base64url"); return `${payload}.${sign(payload)}`; };
const decode = <T>(token: string | undefined): T | null => {
  if (!token || !serverConfig.otpSessionSecret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T; } catch { return null; }
};

export const normaliseIndianPhone = (value: string) => value.replace(/[^\d]/g, "").replace(/^91(?=\d{10}$)/, "");
export const isOtpConfigured = () => Boolean(serverConfig.twoFactorApiKey && serverConfig.otpSessionSecret);
export const createPendingOtp = (phone: string, sessionId: string) => encode({ phone, sessionId, expiresAt: Date.now() + ttlMs });
export const createVerifiedOtp = (phone: string) => encode({ phone, expiresAt: Date.now() + ttlMs });
export const readPendingOtp = (token: string | undefined) => { const value = decode<PendingOtp>(token); return value && value.expiresAt > Date.now() ? value : null; };
export const isPhoneOtpVerified = (token: string | undefined, phone: string) => { const value = decode<VerifiedOtp>(token); return Boolean(value && value.expiresAt > Date.now() && value.phone === phone); };

export async function requestOtp(phone: string) {
  if (!serverConfig.twoFactorApiKey) throw new Error("OTP provider is not configured");
  const response = await fetch(`https://2factor.in/API/V1/${encodeURIComponent(serverConfig.twoFactorApiKey)}/SMS/${phone}/AUTOGEN`, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(8_000) });
  const body = await response.json() as { Status?: string; Details?: string };
  if (!response.ok || body.Status !== "Success" || !body.Details) throw new Error("OTP request failed");
  return body.Details;
}

export async function verifyOtp(sessionId: string, code: string) {
  if (!serverConfig.twoFactorApiKey) throw new Error("OTP provider is not configured");
  const response = await fetch(`https://2factor.in/API/V1/${encodeURIComponent(serverConfig.twoFactorApiKey)}/SMS/VERIFY/${encodeURIComponent(sessionId)}/${encodeURIComponent(code)}`, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(8_000) });
  const body = await response.json() as { Status?: string };
  return response.ok && body.Status === "Success";
}
