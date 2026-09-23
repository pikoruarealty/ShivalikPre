import { NextRequest } from "next/server";
import { apiResponse, enforceRateLimit, readJsonBody, requestAddress, validateMutationRequest } from "@/lib/api-security";
import { createPendingOtp, isOtpConfigured, normaliseIndianPhone, otpPendingCookie, requestOtp } from "@/lib/otp";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const invalidRequest = validateMutationRequest(request, 2_000);
    if (invalidRequest) return invalidRequest;
    const addressLimit = enforceRateLimit(`otp-request:address:${requestAddress(request)}`, 12, 10 * 60 * 1_000);
    if (addressLimit) return addressLimit;
    if (!isOtpConfigured()) return apiResponse({ ok: false, error: "OTP is unavailable right now." }, 503);

    const body = await readJsonBody(request, 2_000);
    const phone = body && typeof body === "object" ? (body as Record<string, unknown>).phone : undefined;
    const normalised = typeof phone === "string" ? normaliseIndianPhone(phone) : "";
    if (!/^\d{10}$/.test(normalised)) return apiResponse({ ok: false, error: "Enter a valid 10-digit mobile number." }, 400);

    const phoneLimit = enforceRateLimit(`otp-request:phone:${normalised}`, 4, 10 * 60 * 1_000);
    if (phoneLimit) return phoneLimit;
    const code = await requestOtp(normalised);
    const response = apiResponse({ ok: true });
    response.cookies.set(otpPendingCookie, createPendingOtp(normalised, code), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 300,
      path: "/",
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") return apiResponse({ ok: false, error: "Request is too large." }, 413);
    return apiResponse({ ok: false, error: "Couldn’t send the OTP. Please try again." }, 502);
  }
}
