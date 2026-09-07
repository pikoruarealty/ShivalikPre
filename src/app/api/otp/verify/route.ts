import { NextRequest, NextResponse } from "next/server";
import { createVerifiedOtp, normaliseIndianPhone, otpPendingCookie, otpVerifiedCookie, readPendingOtp, verifyOtp } from "@/lib/otp";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json() as { phone?: unknown; code?: unknown };
    const normalised = typeof phone === "string" ? normaliseIndianPhone(phone) : "";
    const otp = typeof code === "string" ? code.replace(/\D/g, "") : "";
    const pending = readPendingOtp(request.cookies.get(otpPendingCookie)?.value);
    if (!pending || pending.phone !== normalised || !/^\d{4,8}$/.test(otp)) return NextResponse.json({ ok: false, error: "Request a new OTP and try again." }, { status: 400 });
    if (!await verifyOtp(pending.sessionId, otp)) return NextResponse.json({ ok: false, error: "The OTP is incorrect or expired." }, { status: 400 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(otpVerifiedCookie, createVerifiedOtp(normalised), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
    response.cookies.delete(otpPendingCookie);
    return response;
  } catch { return NextResponse.json({ ok: false, error: "Couldn’t verify the OTP. Please try again." }, { status: 502 }); }
}
