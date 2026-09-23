import "server-only";
import { NextRequest, NextResponse } from "next/server";

type RateLimitRecord = { count: number; resetAt: number };
const rateLimits = new Map<string, RateLimitRecord>();

export function apiResponse(body: unknown, status = 200, extraHeaders?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0", ...extraHeaders },
  });
}

export function validateMutationRequest(request: NextRequest, maximumBytes = 8_000) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return apiResponse({ ok: false, error: "Unsupported request." }, 415);
  }
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (!Number.isFinite(declaredSize) || declaredSize > maximumBytes) {
    return apiResponse({ ok: false, error: "Request is too large." }, 413);
  }
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if ((origin && origin !== request.nextUrl.origin) || fetchSite === "cross-site") {
    return apiResponse({ ok: false, error: "Request origin is not allowed." }, 403);
  }
  return null;
}

export async function readJsonBody(request: NextRequest, maximumBytes = 8_000) {
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maximumBytes) throw new Error("PAYLOAD_TOO_LARGE");
  return JSON.parse(raw) as unknown;
}

export function requestAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function enforceRateLimit(key: string, maximum: number, windowMs: number) {
  const now = Date.now();
  if (rateLimits.size > 5_000) {
    for (const [storedKey, record] of rateLimits) if (record.resetAt <= now) rateLimits.delete(storedKey);
  }
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  current.count += 1;
  if (current.count <= maximum) return null;
  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1_000));
  return apiResponse({ ok: false, error: "Too many requests. Please try again shortly." }, 429, { "Retry-After": String(retryAfter) });
}
