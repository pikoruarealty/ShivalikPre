"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { project } from "@/data/project";
import { trackEvent } from "@/lib/analytics";
import { getAttribution, normalisePhone, submitLead, type LeadVariant } from "@/lib/leads";

type Props = { source: string; variant: LeadVariant; onSuccess: () => void };
type Fields = { name: string; lastName: string; phone: string; email: string; requirement: string; budget: string };
type OtpStage = "closed" | "sending" | "sent" | "verifying" | "verified" | "send-error" | "submit-error";

const initialFields: Fields = { name: "", lastName: "", phone: "", email: "", requirement: "", budget: "" };
const validPhone = (phone: string) => /^(?:\+?\d{1,3})?\d{10}$/.test(phone);
const blankOtp = ["", "", "", ""];

export function LeadForm({ source, variant, onSuccess }: Props) {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(blankOtp);
  const [otpStage, setOtpStage] = useState<OtpStage>("closed");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const hasStarted = useRef(false);
  const otpRequestId = useRef(0);
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);
  const phoneInput = useRef<HTMLInputElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const otpOpen = otpStage !== "closed";

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => setResendIn((seconds) => Math.max(0, seconds - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  useEffect(() => {
    if (otpStage === "sent") window.requestAnimationFrame(() => otpInputs.current[0]?.focus());
  }, [otpStage]);

  const change = (key: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    if (key === "phone") {
      otpRequestId.current += 1;
      setOtpDigits(blankOtp);
      setOtpError("");
      setResendIn(0);
      setOtpStage("closed");
    }
  };

  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.requirement) next.requirement = "Please select your requirement.";
    if (!fields.budget) next.budget = "Please select a budget range.";
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

  const requestPhoneOtp = async () => {
    const phone = normalisePhone(fields.phone);
    if (!validPhone(phone)) {
      setErrors((current) => ({ ...current, phone: "Please enter a valid mobile number." }));
      setOtpStage("closed");
      window.requestAnimationFrame(() => phoneInput.current?.focus());
      return;
    }
    const requestId = ++otpRequestId.current;
    setOtpDigits(blankOtp);
    setOtpStage("sending");
    setOtpError("");
    setResendIn(0);
    try {
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
        signal: AbortSignal.timeout(12_000),
      });
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error);
      if (requestId !== otpRequestId.current || phone !== normalisePhone(fields.phone)) return;
      setOtpStage("sent");
      setResendIn(29);
      trackEvent("lead_otp_sent", { source });
    } catch (error) {
      if (requestId !== otpRequestId.current) return;
      setOtpStage("send-error");
      setOtpError(error instanceof DOMException && error.name === "TimeoutError" ? "OTP delivery took too long. Please try again." : error instanceof Error ? error.message : "Couldn’t send the OTP.");
    }
  };

  const submitVerifiedLead = async () => {
    setSubmitting(true);
    setSubmitError("");
    setShowWhatsAppFallback(false);
    trackEvent("lead_form_submit", { source, variant });
    try {
      const name = `${fields.name.trim()} ${fields.lastName.trim()}`.trim();
      const requirement = `${fields.requirement} · Budget: ${fields.budget}`;
      const result = await submitLead({
        name,
        phone: normalisePhone(fields.phone),
        email: fields.email.trim(),
        requirement,
        source,
        variant,
        attribution: getAttribution(),
        website: honeypot.current?.value ?? "",
      });
      if (!result.ok) throw new Error("Lead submission failed");
      trackEvent("lead_form_success", { source, variant });
      if (fields.requirement === "Private Presentation / Site Visit") trackEvent("site_visit_request", { source });
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof DOMException && error.name === "TimeoutError" ? "The request took too long. Please try again." : "We couldn’t record your request right now. Please try again.");
      setShowWhatsAppFallback(true);
      setOtpStage("submit-error");
      trackEvent("lead_form_error", { source, variant });
    } finally {
      setSubmitting(false);
    }
  };

  const verifyPhoneOtp = async (code: string) => {
    if (otpStage !== "sent") return;
    const requestId = ++otpRequestId.current;
    const phone = normalisePhone(fields.phone);
    setOtpStage("verifying");
    setOtpError("");
    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
        signal: AbortSignal.timeout(12_000),
      });
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error);
      if (requestId !== otpRequestId.current || phone !== normalisePhone(fields.phone)) return;
      setOtpStage("verified");
      trackEvent("lead_otp_verified", { source });
      window.setTimeout(() => void submitVerifiedLead(), 650);
    } catch (error) {
      if (requestId !== otpRequestId.current) return;
      setOtpDigits(blankOtp);
      setOtpStage("sent");
      setOtpError(error instanceof Error ? error.message : "Couldn’t verify the OTP.");
    }
  };

  const updateOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    setOtpError("");
    if (digit && index < 3) otpInputs.current[index + 1]?.focus();
    if (next.every(Boolean)) void verifyPhoneOtp(next.join(""));
  };

  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) otpInputs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) otpInputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 3) otpInputs.current[index + 1]?.focus();
  };

  const pasteOtp = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4).split("");
    if (!digits.length) return;
    const next = blankOtp.map((_, index) => digits[index] ?? "");
    setOtpDigits(next);
    if (next.every(Boolean)) void verifyPhoneOtp(next.join(""));
    else otpInputs.current[Math.min(digits.length, 3)]?.focus();
  };

  const editNumber = () => {
    otpRequestId.current += 1;
    setOtpStage("closed");
    setOtpDigits(blankOtp);
    setOtpError("");
    setResendIn(0);
    window.requestAnimationFrame(() => phoneInput.current?.focus());
  };

  const beginVerification = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    void requestPhoneOtp();
  };

  const whatsappMessage = encodeURIComponent([
    "Hello, I would like to request details for Shivalik Présenté.",
    `Name: ${`${fields.name.trim()} ${fields.lastName.trim()}`.trim()}`,
    `Phone: +91 ${fields.phone}`,
    `Email: ${fields.email.trim()}`,
    `Requirement: ${fields.requirement || "General Enquiry"}`,
    `Budget: ${fields.budget || "Not selected"}`,
  ].join("\n"));

  return (
    <form className="lead-form" noValidate onSubmit={beginVerification} onFocus={trackStart}>
      <div className="lead-form-fields" inert={otpOpen ? true : undefined} aria-hidden={otpOpen || undefined}>
        <input ref={honeypot} className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="lead-field requirement-field">
          <label htmlFor="lead-requirement">Requirement</label>
          <select id="lead-requirement" required value={fields.requirement} onChange={(event) => change("requirement", event.target.value)} aria-invalid={Boolean(errors.requirement)}>
            <option value="">Select requirement</option>
            <option>Current price &amp; availability</option>
            <option>4 BHK Residence</option>
            <option>Larger-format residence</option>
            <option>6 BHK Duplex Penthouse</option>
            <option>Investment Enquiry</option>
            <option>Private Presentation / Site Visit</option>
          </select>
          {errors.requirement && <p className="lead-error">{errors.requirement}</p>}
        </div>
        <div className="lead-field budget-field">
          <label htmlFor="lead-budget">Budget (INR)</label>
          <select id="lead-budget" required value={fields.budget} onChange={(event) => change("budget", event.target.value)} aria-invalid={Boolean(errors.budget)}>
            <option value="">Select budget</option>
            <option>₹2 Cr–₹3 Cr</option>
            <option>₹3 Cr–₹4 Cr</option>
            <option>₹4 Cr–₹5 Cr</option>
            <option>₹5 Cr–₹7 Cr</option>
            <option>₹7 Cr–₹10 Cr</option>
            <option>₹10 Cr+</option>
          </select>
          {errors.budget && <p className="lead-error">{errors.budget}</p>}
        </div>
        <div className="lead-field">
          <label htmlFor="lead-name">First name</label>
          <input id="lead-name" required placeholder="First name" value={fields.name} onChange={(event) => change("name", event.target.value)} autoComplete="given-name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "lead-name-error" : undefined} />
          {errors.name && <p id="lead-name-error" className="lead-error">{errors.name}</p>}
        </div>
        <div className="lead-field last-name-field">
          <label htmlFor="lead-last-name">Last name <small>Optional</small></label>
          <input id="lead-last-name" placeholder="Last name" value={fields.lastName} onChange={(event) => change("lastName", event.target.value)} autoComplete="family-name" />
        </div>
        <div className="lead-field">
          <label htmlFor="lead-email">Email address</label>
          <input id="lead-email" required type="email" placeholder="you@email.com" value={fields.email} onChange={(event) => change("email", event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "lead-email-error" : undefined} />
          {errors.email && <p id="lead-email-error" className="lead-error">{errors.email}</p>}
        </div>
        <div className="lead-field">
          <label htmlFor="lead-phone">Phone number</label>
          <div className="phone-field"><span>+91</span><input ref={phoneInput} id="lead-phone" required inputMode="tel" maxLength={10} placeholder="10-digit mobile number" value={fields.phone} onChange={(event) => change("phone", event.target.value.replace(/\D/g, ""))} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "lead-phone-error" : undefined} /></div>
          {errors.phone && <p id="lead-phone-error" className="lead-error">{errors.phone}</p>}
        </div>
        <p className="lead-value-line"><span>◆</span> Current availability <span>◆</span> Floor plan guidance</p>
        <button className="button button-primary lead-submit" disabled={submitting}>Continue securely <span aria-hidden="true">→</span></button>
        <p className="lead-privacy">By continuing, you agree to receive project updates via call, SMS and email. <Link href="/privacy">Privacy</Link></p>
      </div>

      {otpOpen && (
        <div className="otp-step-backdrop">
          <div className="otp-dialog" role="dialog" aria-modal="true" aria-labelledby="otp-dialog-title" aria-describedby="otp-dialog-description">
            {otpStage === "sending" && (
              <div className="otp-state-panel" role="status" aria-live="polite">
                <div className="otp-sending-animation" aria-hidden="true"><span /><i /><b /></div>
                <p className="otp-kicker">Secure verification</p>
                <h3 id="otp-dialog-title">Sending your code</h3>
                <p id="otp-dialog-description">Connecting securely and sending a 4-digit OTP to +91 {fields.phone}.</p>
                <div className="otp-loading-line" aria-hidden="true"><i /></div>
              </div>
            )}

            {(otpStage === "sent" || otpStage === "verifying") && (
              <div className="otp-state-panel">
                <div className="otp-mini-mark" aria-hidden="true">04</div>
                <p className="otp-kicker">Code sent</p>
                <h3 id="otp-dialog-title">Verify your number</h3>
                <p id="otp-dialog-description">Enter the 4-digit OTP sent to <strong>+91 {fields.phone}</strong>.</p>
                <div className="otp-digit-row" onPaste={(event) => { event.preventDefault(); pasteOtp(event.clipboardData.getData("text")); }}>
                  {otpDigits.map((digit, index) => (
                    <input key={index} ref={(element) => { otpInputs.current[index] = element; }} aria-label={`OTP digit ${index + 1}`} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} value={digit} disabled={otpStage === "verifying"} onChange={(event) => updateOtpDigit(index, event.target.value)} onKeyDown={(event) => handleOtpKeyDown(index, event)} />
                  ))}
                </div>
                <div className={`otp-verification-status ${otpStage === "verifying" ? "is-active" : ""}`} role="status">
                  <i aria-hidden="true" />{otpStage === "verifying" ? "Checking your code…" : "Verification happens automatically"}
                </div>
                {otpError && <p className="otp-error" role="alert">{otpError}</p>}
                <div className="otp-dialog-actions">
                  <button type="button" className="otp-text-action" onClick={() => void requestPhoneOtp()} disabled={resendIn > 0 || otpStage === "verifying"}>{resendIn > 0 ? `Resend in 00:${String(resendIn).padStart(2, "0")}` : "Resend OTP"}</button>
                  <button type="button" className="otp-text-action" onClick={editNumber} disabled={otpStage === "verifying"}>Edit number</button>
                </div>
              </div>
            )}

            {otpStage === "verified" && (
              <div className="otp-state-panel otp-verified-panel" role="status" aria-live="polite">
                <div className="otp-success-check" aria-hidden="true"><span>✓</span></div>
                <p className="otp-kicker">Verified securely</p>
                <h3 id="otp-dialog-title">Number confirmed</h3>
                <p id="otp-dialog-description">Preparing your private project request…</p>
                <div className="otp-loading-line is-complete" aria-hidden="true"><i /></div>
              </div>
            )}

            {otpStage === "send-error" && (
              <div className="otp-state-panel">
                <div className="otp-mini-mark is-error" aria-hidden="true">!</div>
                <p className="otp-kicker">Delivery interrupted</p>
                <h3 id="otp-dialog-title">OTP couldn’t be sent</h3>
                <p id="otp-dialog-description">{otpError || "Please try again in a moment."}</p>
                <div className="otp-dialog-actions is-centered">
                  <button type="button" className="button otp-primary-action" onClick={() => void requestPhoneOtp()}>Try again</button>
                  <button type="button" className="otp-text-action" onClick={editNumber}>Edit number</button>
                </div>
              </div>
            )}

            {otpStage === "submit-error" && (
              <div className="otp-state-panel">
                <div className="otp-mini-mark is-error" aria-hidden="true">!</div>
                <p className="otp-kicker">Almost there</p>
                <h3 id="otp-dialog-title">Please retry</h3>
                <p id="otp-dialog-description">{submitError}</p>
                <div className="otp-dialog-actions is-centered">
                  <button type="button" className="button otp-primary-action" onClick={() => void submitVerifiedLead()} disabled={submitting}>{submitting ? "Submitting…" : "Submit again"}</button>
                  {showWhatsAppFallback && <a className="otp-text-action" href={`https://wa.me/${project.contact.whatsapp}?text=${whatsappMessage}`} target="_blank" rel="noreferrer">Continue on WhatsApp</a>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
