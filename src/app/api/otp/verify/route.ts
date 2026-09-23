import { NextRequest } from "next/server";
import { apiResponse, enforceRateLimit, readJsonBody, requestAddress, validateMutationRequest } from "@/lib/api-security";
import { createVerifiedOtp, matchesPendingOtp, normaliseIndianPhone, otpPendingCookie, otpVerifiedCookie, readPendingOtp } from "@/lib/otp";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const invalidRequest = validateMutationRequest(request, 2_000);
    if (invalidRequest) return invalidRequest;
    const addressLimit = enforceRateLimit(`otp-verify:address:${requestAddress(request)}`, 30, 10 * 60 * 1_000);
    if (addressLimit) return addressLimit;

    const body = await readJsonBody(request, 2_000);
    const values = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const normalised = typeof values.phone === "string" ? normaliseIndianPhone(values.phone) : "";
    const otp = typeof values.code === "string" ? values.code.replace(/\D/g, "") : "";
    const pending = readPendingOtp(request.cookies.get(otpPendingCookie)?.value);
    if (!pending || pending.phone !== normalised || !/^\d{4}$/.test(otp)) {
      return apiResponse({ ok: false, error: "Request a new OTP and try again." }, 400);
    }

    const sessionLimit = enforceRateLimit(`otp-verify:challenge:${pending.otpHash}`, 8, 10 * 60 * 1_000);
    if (sessionLimit) return sessionLimit;
    if (!matchesPendingOtp(pending, otp)) return apiResponse({ ok: false, error: "The OTP is incorrect or expired." }, 400);

    const response = apiResponse({ ok: true });
    response.cookies.set(otpVerifiedCookie, createVerifiedOtp(normalised), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
      path: "/",
    });
    response.cookies.delete(otpPendingCookie);
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") return apiResponse({ ok: false, error: "Request is too large." }, 413);
    return apiResponse({ ok: false, error: "Couldn’t verify the OTP. Please try again." }, 502);
  }
}
