"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { getAttribution, normalisePhone, submitLead, type LeadVariant } from "@/lib/leads";

type Props = { source: string; variant: LeadVariant; onSuccess: () => void };
type Fields = { name: string; lastName: string; phone: string; email: string; requirement: string };
const initialFields: Fields = { name: "", lastName: "", phone: "", email: "", requirement: "" };

export function LeadForm({ source, variant, onSuccess }: Props) {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpState, setOtpState] = useState<"idle" | "sending" | "sent" | "verifying" | "verified">("idle");
  const [otpError, setOtpError] = useState("");
  const hasStarted = useRef(false);
  const change = (key: keyof Fields, value: string) => { setFields((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: "" })); if (key === "phone") { setOtp(""); setOtpError(""); setOtpState("idle"); } };
  const validate = () => {
    const next: Partial<Fields> = {};
    if (fields.name.trim().length < 2 || fields.name.trim().length > 100) next.name = "Please enter your first name.";
    const phone = normalisePhone(fields.phone);
    if (!/^(?:\+?\d{1,3})?\d{10}$/.test(phone)) next.phone = "Please enter a valid mobile number.";
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "Please enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    if (otpState !== "verified") { setOtpError("Please verify your mobile number with OTP."); return; }
    setSubmitting(true);
    trackEvent("lead_form_submit", { source, variant });
    try {
      const website = String(new FormData(event.currentTarget).get("website") ?? "");
      const name = `${fields.name.trim()} ${fields.lastName.trim()}`.trim();
      const result = await submitLead({ name, phone: normalisePhone(fields.phone), email: fields.email.trim() || undefined, requirement: fields.requirement || undefined, source, variant, attribution: getAttribution(), website });
      if (result.ok) { trackEvent("lead_form_success", { source, variant }); onSuccess(); } else { throw new Error("Lead submission failed"); }
    } catch { setSubmitError("We couldn’t submit your request right now. Please try again."); trackEvent("lead_form_error", { source, variant }); } finally { setSubmitting(false); }
  };

  const trackStart = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackEvent("lead_form_start", { source, variant });
  };
  const sendOtp = async () => {
    const phone = normalisePhone(fields.phone);
    if (!/^(?:\+?\d{1,3})?\d{10}$/.test(phone)) { setErrors((current) => ({ ...current, phone: "Please enter a valid mobile number." })); return; }
    setOtpState("sending"); setOtpError("");
    try { const response = await fetch("/api/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) }); const result = await response.json() as { ok: boolean; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error); setOtpState("sent"); } catch (error) { setOtpState("idle"); setOtpError(error instanceof Error ? error.message : "Couldn’t send the OTP."); }
  };
  const verifyPhoneOtp = async () => {
    setOtpState("verifying"); setOtpError("");
    try { const response = await fetch("/api/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: normalisePhone(fields.phone), code: otp }) }); const result = await response.json() as { ok: boolean; error?: string }; if (!response.ok || !result.ok) throw new Error(result.error); setOtpState("verified"); } catch (error) { setOtpState("sent"); setOtpError(error instanceof Error ? error.message : "Couldn’t verify the OTP."); }
  };
  return <form className="lead-form" noValidate onSubmit={submit} onFocus={trackStart}>
    <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="lead-field requirement-field"><label htmlFor="lead-requirement">Requirement</label><select id="lead-requirement" value={fields.requirement} onChange={(event) => change("requirement", event.target.value)}><option value="">Select requirement</option><option>4 BHK Residence</option><option>6 BHK Duplex Penthouse</option><option>Investment Enquiry</option><option>Private Presentation / Site Visit</option><option>General Enquiry</option></select></div>
    <div className="lead-field"><label htmlFor="lead-name">First name</label><input id="lead-name" required value={fields.name} onChange={(event) => change("name", event.target.value)} autoComplete="given-name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "lead-name-error" : undefined} />{errors.name && <p id="lead-name-error" className="lead-error">{errors.name}</p>}</div>
    <div className="lead-field last-name-field"><label htmlFor="lead-last-name">Last name <small>Optional</small></label><input id="lead-last-name" value={fields.lastName} onChange={(event) => change("lastName", event.target.value)} autoComplete="family-name" /></div>
    <div className="lead-field"><label htmlFor="lead-phone">Phone number</label><div className="otp-phone-row"><div className="phone-field"><span>+91</span><input id="lead-phone" required inputMode="tel" placeholder="Mobile number" value={fields.phone} onChange={(event) => change("phone", event.target.value)} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "lead-phone-error" : undefined} /></div><button type="button" className="otp-action" onClick={sendOtp} disabled={otpState === "sending" || otpState === "verifying" || otpState === "verified"}>{otpState === "sending" ? "Sending…" : otpState === "verified" ? "Verified" : "Send OTP"}</button></div>{errors.phone && <p id="lead-phone-error" className="lead-error">{errors.phone}</p>}{otpState === "sent" || otpState === "verifying" ? <div className="otp-code-row"><input aria-label="OTP code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} placeholder="Enter OTP" value={otp} onChange={(event) => setOtp(event.target.value)} /><button type="button" className="otp-action" onClick={verifyPhoneOtp} disabled={otpState === "verifying" || !otp}>{otpState === "verifying" ? "Verifying…" : "Verify"}</button></div> : null}{otpState === "verified" && <p className="otp-success" role="status">Mobile number verified.</p>}{otpError && <p className="lead-error" role="alert">{otpError}</p>}</div>
    <div className="lead-field"><label htmlFor="lead-email">Email address <small>Optional</small></label><input id="lead-email" type="email" value={fields.email} onChange={(event) => change("email", event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "lead-email-error" : undefined} />{errors.email && <p id="lead-email-error" className="lead-error">{errors.email}</p>}</div>
    <button className="button button-primary lead-submit" disabled={submitting}>{submitting ? "Recording request…" : "Request Private Presentation"}</button>
    {submitError && <p className="lead-error" role="alert">{submitError}</p>}<p className="lead-privacy">By submitting, you agree to receive project updates. <Link href="/privacy">Privacy</Link></p>
  </form>;
}
