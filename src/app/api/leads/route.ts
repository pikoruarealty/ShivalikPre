import { NextRequest, NextResponse } from "next/server";
import { isBrevoConfigured, isSupabaseConfigured, saveLead, sendLeadNotification, type StoredLead } from "@/lib/lead-delivery";
import { isOtpConfigured, isPhoneOtpVerified } from "@/lib/otp";

export const runtime = "nodejs";
export const maxDuration = 20;

const text = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const variants = new Set(["private-presentation", "brochure", "project-details", "general-enquiry"]);
const fail = (status: number) =>
  NextResponse.json(
    { ok: false, error: "We couldn’t submit your request right now. Please try again." },
    { status },
  );

export async function POST(request: NextRequest) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) return fail(415);
    const size = Number(request.headers.get("content-length") ?? 0);
    if (size > 8_000) return fail(413);
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) return fail(403);
    if (!isBrevoConfigured()) {
      return NextResponse.json(
        { ok: false, configured: false, error: "We couldn’t submit your request right now. Please try again." },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return fail(400);
    const values = body as Record<string, unknown>;
    if (text(values.website, 1)) return NextResponse.json({ ok: true });

    const name = text(values.name, 100);
    const phone = text(values.phone, 24).replace(/[\s()-]/g, "");
    const mail = text(values.email, 160);
    const source = text(values.source, 80);
    const variant = text(values.variant, 40);
    if (
      name.length < 2 ||
      !/^(?:\+?\d{1,3})?\d{10}$/.test(phone) ||
      (mail && !email.test(mail)) ||
      !source ||
      !variants.has(variant)
    ) return fail(400);
    if (!isOtpConfigured() || !isPhoneOtpVerified(request.cookies.get("lead_otp_verified")?.value, phone.replace(/^\+?91/, ""))) return fail(403);

    const leadInput = {
      name,
      phone,
      email: mail || undefined,
      requirement: text(values.requirement, 80) || undefined,
      source,
      variant,
      pathname: text(values.pathname, 180) || undefined,
      referrer: text(values.referrer, 300) || undefined,
      utm_source: text(values.utm_source, 120) || undefined,
      utm_medium: text(values.utm_medium, 120) || undefined,
      utm_campaign: text(values.utm_campaign, 120) || undefined,
      utm_content: text(values.utm_content, 120) || undefined,
      utm_term: text(values.utm_term, 120) || undefined,
    };
    const lead: StoredLead = isSupabaseConfigured()
      ? await saveLead(leadInput)
      : { id: crypto.randomUUID(), ...leadInput, created_at: new Date().toISOString() };
    await sendLeadNotification(lead);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead delivery failed", error);
    return fail(502);
  }
}
