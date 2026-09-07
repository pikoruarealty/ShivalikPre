import { NextRequest, NextResponse } from "next/server";
import { createPendingOtp, isOtpConfigured, normaliseIndianPhone, otpPendingCookie, requestOtp } from "@/lib/otp";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    if (!isOtpConfigured()) return NextResponse.json({ ok: false, error: "OTP is unavailable right now." }, { status: 503 });
    const { phone } = await request.json() as { phone?: unknown };
    const normalised = typeof phone === "string" ? normaliseIndianPhone(phone) : "";
    if (!/^\d{10}$/.test(normalised)) return NextResponse.json({ ok: false, error: "Enter a valid 10-digit mobile number." }, { status: 400 });
    const sessionId = await requestOtp(normalised);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(otpPendingCookie, createPendingOtp(normalised, sessionId), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
    return response;
  } catch { return NextResponse.json({ ok: false, error: "Couldn’t send the OTP. Please try again." }, { status: 502 }); }
}
