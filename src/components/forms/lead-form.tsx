"use client";

import { FormEvent, useState } from "react";
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
  const change = (key: keyof Fields, value: string) => { setFields((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: "" })); };
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
    setSubmitting(true);
    trackEvent("lead_form_submit", { source, variant });
    try {
      const website = String(new FormData(event.currentTarget).get("website") ?? "");
      const name = `${fields.name.trim()} ${fields.lastName.trim()}`.trim();
      const result = await submitLead({ name, phone: normalisePhone(fields.phone), email: fields.email.trim() || undefined, requirement: fields.requirement || undefined, source, variant, attribution: getAttribution(), website });
      if (result.ok) { trackEvent("lead_form_success", { source, variant }); onSuccess(); } else { throw new Error("Lead submission failed"); }
    } catch { setSubmitError("We couldn’t submit your request right now. Please try again."); trackEvent("lead_form_error", { source, variant }); } finally { setSubmitting(false); }
  };

  return <form className="lead-form" noValidate onSubmit={submit} onFocus={() => trackEvent("lead_form_start", { source, variant })}>
    <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="lead-field requirement-field"><label htmlFor="lead-requirement">Requirement</label><select id="lead-requirement" value={fields.requirement} onChange={(event) => change("requirement", event.target.value)}><option value="">Select requirement</option><option>4 BHK Residence</option><option>6 BHK Duplex Penthouse</option><option>Investment Enquiry</option><option>Private Presentation / Site Visit</option><option>General Enquiry</option></select></div>
    <div className="lead-field"><label htmlFor="lead-name">First name</label><input id="lead-name" value={fields.name} onChange={(event) => change("name", event.target.value)} autoComplete="given-name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "lead-name-error" : undefined} />{errors.name && <p id="lead-name-error" className="lead-error">{errors.name}</p>}</div>
    <div className="lead-field"><label htmlFor="lead-last-name">Last name <small>Optional</small></label><input id="lead-last-name" value={fields.lastName} onChange={(event) => change("lastName", event.target.value)} autoComplete="family-name" /></div>
    <div className="lead-field"><label htmlFor="lead-phone">Phone number</label><div className="phone-field"><span>+91</span><input id="lead-phone" inputMode="tel" placeholder="Mobile number" value={fields.phone} onChange={(event) => change("phone", event.target.value)} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "lead-phone-error" : undefined} /></div>{errors.phone && <p id="lead-phone-error" className="lead-error">{errors.phone}</p>}</div>
    <div className="lead-field"><label htmlFor="lead-email">Email address <small>Optional</small></label><input id="lead-email" type="email" value={fields.email} onChange={(event) => change("email", event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "lead-email-error" : undefined} />{errors.email && <p id="lead-email-error" className="lead-error">{errors.email}</p>}</div>
    <button className="button button-primary lead-submit" disabled={submitting}>{submitting ? "Recording request…" : "Request Private Presentation"}</button>
    {submitError && <p className="lead-error" role="alert">{submitError}</p>}<p className="lead-privacy">By submitting, you agree to receive project updates. <Link href="/privacy">Privacy</Link></p>
  </form>;
}
