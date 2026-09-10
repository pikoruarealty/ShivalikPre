"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { project } from "@/data/project";
import { trackEvent } from "@/lib/analytics";
import { getAttribution, normalisePhone, submitLead, type LeadVariant } from "@/lib/leads";

type Props = { source: string; variant: LeadVariant; onSuccess: () => void };
type Fields = { name: string; lastName: string; phone: string; email: string; requirement: string };
const initialFields: Fields = { name: "", lastName: "", phone: "", email: "", requirement: "" };
const validPhone = (phone: string) => /^(?:\+?\d{1,3})?\d{10}$/.test(phone);

export function LeadForm({ source, variant, onSuccess }: Props) {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpState, setOtpState] = useState<"idle" | "sending" | "sent" | "verifying" | "verified">("idle");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const hasStarted = useRef(false);
  const otpRequestId = useRef(0);
  const otpInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => setResendIn((seconds) => Math.max(0, seconds - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  const change = (key: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    if (key === "phone") { otpRequestId.current += 1; setOtp(""); setOtpError(""); setResendIn(0); setOtpState("idle"); }
  };

  const validate = () => {
    const next: Partial<Fields> = {};
    if (fields.name.trim().length < 2 || fields.name.trim().length > 100) next.name = "Please enter your first name.";
    if (!validPhone(normalisePhone(fields.phone))) next.phone = "Please enter a valid mobile number.";
    if (!fields.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "Please enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const trackStart = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackEvent("lead_form_start", { source, variant });
  };

  const sendOtp = async () => {
    const phone = normalisePhone(fields.phone);
    if (!validPhone(phone)) { setErrors((current) => ({ ...current, phone: "Please enter a valid mobile number." })); return; }
    if (resendIn > 0) return;
    const requestId = ++otpRequestId.current;
    setOtp(""); setOtpState("sending"); setOtpError("");
    try {
      const response = await fetch("/api/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }), signal: AbortSignal.timeout(12_000) });
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error);
      if (requestId !== otpRequestId.current || phone !== normalisePhone(fields.phone)) return;
      setOtpState("sent"); setResendIn(20);
      window.requestAnimationFrame(() => otpInput.current?.focus());
    } catch (error) {
      if (requestId !== otpRequestId.current) return;
      setOtpState("idle");
      setOtpError(error instanceof DOMException && error.name === "TimeoutError" ? "OTP delivery took too long. Please try again." : error instanceof Error ? error.message : "Couldn’t send the OTP.");
    }
  };

  const verifyPhoneOtp = async (code: string) => {
    const requestId = ++otpRequestId.current;
    const phone = normalisePhone(fields.phone);
    setOtpState("verifying"); setOtpError("");
    try {
      const response = await fetch("/api/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code }), signal: AbortSignal.timeout(12_000) });
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error);
      if (requestId !== otpRequestId.current || phone !== normalisePhone(fields.phone)) return;
      setOtpState("verified");
    } catch (error) {
      if (requestId !== otpRequestId.current) return;
      setOtpState("sent");
      setOtpError(error instanceof Error ? error.message : "Couldn’t verify the OTP.");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(""); setShowWhatsAppFallback(false);
    if (!validate()) return;
    if (otpState !== "verified") { setOtpError("Please verify your mobile number with OTP."); return; }
    setSubmitting(true);
    trackEvent("lead_form_submit", { source, variant });
    try {
      const website = String(new FormData(event.currentTarget).get("website") ?? "");
      const name = `${fields.name.trim()} ${fields.lastName.trim()}`.trim();
      const result = await submitLead({ name, phone: normalisePhone(fields.phone), email: fields.email.trim(), requirement: fields.requirement || undefined, source, variant, attribution: getAttribution(), website });
      if (result.ok) { trackEvent("lead_form_success", { source, variant }); onSuccess(); } else throw new Error("Lead submission failed");
    } catch (error) {
      setSubmitError(error instanceof DOMException && error.name === "TimeoutError" ? "The request took too long. Please try again." : "We couldn’t submit your request right now. Please try again.");
      setShowWhatsAppFallback(true);
      trackEvent("lead_form_error", { source, variant });
    } finally { setSubmitting(false); }
  };

  const updateOtp = (value: string) => {
    const code = value.replace(/\D/g, "").slice(0, 6);
    setOtp(code);
    if (code.length === 6 && otpState === "sent") void verifyPhoneOtp(code);
  };

  const whatsappMessage = encodeURIComponent([
    "Hello, I would like to request a private presentation for Shivalik Présenté.",
    `Name: ${`${fields.name.trim()} ${fields.lastName.trim()}`.trim()}`,
    `Phone: +91 ${fields.phone}`,
    `Email: ${fields.email.trim()}`,
    `Requirement: ${fields.requirement || "General Enquiry"}`,
  ].join("\n"));

  return <form className="lead-form" noValidate onSubmit={submit} onFocus={trackStart}>
    <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="lead-field requirement-field"><label htmlFor="lead-requirement">Requirement</label><select id="lead-requirement" value={fields.requirement} onChange={(event) => change("requirement", event.target.value)}><option value="">Select requirement</option><option>4 BHK Residence</option><option>6 BHK Duplex Penthouse</option><option>Investment Enquiry</option><option>Private Presentation / Site Visit</option><option>General Enquiry</option></select></div>
    <div className="lead-field"><label htmlFor="lead-name">First name</label><input id="lead-name" required value={fields.name} onChange={(event) => change("name", event.target.value)} autoComplete="given-name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "lead-name-error" : undefined} />{errors.name && <p id="lead-name-error" className="lead-error">{errors.name}</p>}</div>
    <div className="lead-field last-name-field"><label htmlFor="lead-last-name">Last name <small>Optional</small></label><input id="lead-last-name" value={fields.lastName} onChange={(event) => change("lastName", event.target.value)} autoComplete="family-name" /></div>
    <div className="lead-field phone-lead-field"><label htmlFor="lead-phone">Phone number</label><div className="otp-phone-row"><div className="phone-field"><span>+91</span><input id="lead-phone" required inputMode="tel" maxLength={10} placeholder="10-digit mobile number" value={fields.phone} onChange={(event) => change("phone", event.target.value.replace(/\D/g, ""))} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "lead-phone-error" : undefined} /></div><button type="button" className="otp-action" onClick={sendOtp} disabled={otpState === "sending" || otpState === "verifying" || otpState === "verified" || resendIn > 0}>{otpState === "sending" ? "Sending…" : otpState === "verified" ? "Verified" : resendIn > 0 ? `Resend in ${resendIn}s` : otpState === "sent" ? "Resend OTP" : "Send OTP"}</button></div>{errors.phone && <p id="lead-phone-error" className="lead-error">{errors.phone}</p>}{otpState === "sent" || otpState === "verifying" ? <><div className="otp-code-row"><input ref={otpInput} aria-label="OTP code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Enter 6-digit OTP" value={otp} onChange={(event) => updateOtp(event.target.value)} disabled={otpState === "verifying"} /><span className="otp-auto-status" role="status">{otpState === "verifying" ? "Verifying…" : "Enter the SMS code"}</span></div>{otpState === "sent" && <p className="otp-delivery-note" role="status">OTP requested. SMS usually arrives within a few seconds.</p>}</> : null}{otpState === "verified" && <p className="otp-success" role="status">Mobile number verified.</p>}{otpError && <p className="lead-error" role="alert">{otpError}</p>}</div>
    <div className="lead-field"><label htmlFor="lead-email">Email address</label><input id="lead-email" required type="email" value={fields.email} onChange={(event) => change("email", event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "lead-email-error" : undefined} />{errors.email && <p id="lead-email-error" className="lead-error">{errors.email}</p>}</div>
    <button className="button button-primary lead-submit" disabled={submitting}>{submitting ? "Recording request…" : "Request Private Presentation"}</button>
    {submitError && <p className="lead-error" role="alert">{submitError}</p>}{showWhatsAppFallback && <a className="button lead-whatsapp-fallback" href={`https://wa.me/${project.contact.whatsapp}?text=${whatsappMessage}`} target="_blank" rel="noreferrer">Continue on WhatsApp</a>}<p className="lead-privacy">By submitting, you agree to receive project updates. <Link href="/privacy">Privacy</Link></p>
  </form>;
}
