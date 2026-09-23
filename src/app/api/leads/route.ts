import { NextRequest } from "next/server";
import { apiResponse, enforceRateLimit, readJsonBody, requestAddress, validateMutationRequest } from "@/lib/api-security";
import { isBrevoConfigured, isSupabaseConfigured, saveLead, sendLeadNotification, type StoredLead } from "@/lib/lead-delivery";
import { isOtpConfigured, isPhoneOtpVerified, otpVerifiedCookie } from "@/lib/otp";

export const runtime = "nodejs";
export const maxDuration = 20;

const text = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const variants = new Set(["private-presentation", "brochure", "project-details", "general-enquiry"]);
const fail = (status: number) =>
  apiResponse(
    { ok: false, error: "We couldn’t submit your request right now. Please try again." },
    status,
  );

export async function POST(request: NextRequest) {
  try {
    const invalidRequest = validateMutationRequest(request);
    if (invalidRequest) return invalidRequest;

    const addressLimit = enforceRateLimit(
      `lead:address:${requestAddress(request)}`,
      10,
      10 * 60 * 1_000,
    );
    if (addressLimit) return addressLimit;

    const canSaveLead = isSupabaseConfigured();
    const canEmailLead = isBrevoConfigured();
    if (!canSaveLead && !canEmailLead) return fail(503);

    const body = await readJsonBody(request);
    if (!body || typeof body !== "object") return fail(400);
    const values = body as Record<string, unknown>;
    if (text(values.website, 1)) return apiResponse({ ok: true });

    const name = text(values.name, 100);
    const phone = text(values.phone, 24).replace(/[\s()-]/g, "");
    const mail = text(values.email, 160);
    const source = text(values.source, 80);
    const variant = text(values.variant, 40);
    if (
      name.length < 2 ||
      !/^(?:\+?\d{1,3})?\d{10}$/.test(phone) ||
      !email.test(mail) ||
      !source ||
      !variants.has(variant)
    ) return fail(400);

    const normalisedPhone = phone.replace(/^\+?91/, "");
    const phoneLimit = enforceRateLimit(`lead:phone:${normalisedPhone}`, 4, 60 * 60 * 1_000);
    if (phoneLimit) return phoneLimit;
    if (!isOtpConfigured() || !isPhoneOtpVerified(request.cookies.get(otpVerifiedCookie)?.value, normalisedPhone)) return fail(403);

    const leadInput = {
      name,
      phone,
      email: mail,
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
    const lead: StoredLead = { id: crypto.randomUUID(), ...leadInput, created_at: new Date().toISOString() };
    const deliveries: Array<{ channel: "database" | "email"; request: Promise<unknown> }> = [];
    if (canSaveLead) deliveries.push({ channel: "database", request: saveLead(leadInput) });
    if (canEmailLead) deliveries.push({ channel: "email", request: sendLeadNotification(lead) });

    const results = await Promise.allSettled(deliveries.map(({ request: delivery }) => delivery));
    results.forEach((result, index) => {
      if (result.status === "rejected") console.error(`Lead ${deliveries[index].channel} delivery failed`, result.reason);
    });
    if (!results.some((result) => result.status === "fulfilled")) return fail(502);

    const response = apiResponse({ ok: true });
    response.cookies.delete(otpVerifiedCookie);
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") return fail(413);
    console.error("Lead delivery failed", error);
    return fail(502);
  }
}
