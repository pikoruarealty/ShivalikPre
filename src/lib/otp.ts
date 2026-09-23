import "server-only";

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { serverConfig } from "@/lib/server-config";

export const otpPendingCookie = "lead_otp_pending";
export const otpVerifiedCookie = "lead_otp_verified";
const pendingTtlMs = 5 * 60 * 1_000;
const verifiedTtlMs = 10 * 60 * 1_000;

export type PendingOtp = { phone: string; otpHash: string; expiresAt: number };
type VerifiedOtp = { phone: string; expiresAt: number };

const sign = (value: string) => createHmac("sha256", serverConfig.otpSessionSecret ?? "").update(value).digest("base64url");
const otpHash = (phone: string, code: string) => sign(`otp:${phone}:${code}`);
const encode = (value: object) => {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${payload}.${sign(payload)}`;
};
const decode = <T>(token: string | undefined): T | null => {
  if (!token || !serverConfig.otpSessionSecret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
};

export const normaliseIndianPhone = (value: string) => value.replace(/[^\d]/g, "").replace(/^91(?=\d{10}$)/, "");
export const isOtpConfigured = () => Boolean(serverConfig.twoFactorApiKey && serverConfig.otpSessionSecret);
export const createPendingOtp = (phone: string, code: string) => encode({ phone, otpHash: otpHash(phone, code), expiresAt: Date.now() + pendingTtlMs });
export const createVerifiedOtp = (phone: string) => encode({ phone, expiresAt: Date.now() + verifiedTtlMs });
export const readPendingOtp = (token: string | undefined) => {
  const value = decode<PendingOtp>(token);
  return value && value.expiresAt > Date.now() && /^\d{10}$/.test(value.phone) && value.otpHash.length > 20 ? value : null;
};
export const matchesPendingOtp = (pending: PendingOtp, code: string) => {
  if (!/^\d{4}$/.test(code)) return false;
  const candidate = otpHash(pending.phone, code);
  return candidate.length === pending.otpHash.length && timingSafeEqual(Buffer.from(candidate), Buffer.from(pending.otpHash));
};
export const isPhoneOtpVerified = (token: string | undefined, phone: string) => {
  const value = decode<VerifiedOtp>(token);
  return Boolean(value && value.expiresAt > Date.now() && value.phone === phone);
};

export async function requestOtp(phone: string) {
  if (!serverConfig.twoFactorApiKey) throw new Error("OTP provider is not configured");
  const code = randomInt(1_000, 10_000).toString();
  const response = await fetch(
    `https://2factor.in/API/V1/${encodeURIComponent(serverConfig.twoFactorApiKey)}/SMS/${phone}/${code}`,
    { method: "POST", cache: "no-store", signal: AbortSignal.timeout(8_000) },
  );
  const body = await response.json() as { Status?: string };
  if (!response.ok || body.Status !== "Success") throw new Error("OTP request failed");
  return code;
}
