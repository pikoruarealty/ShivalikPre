import Link from "next/link";
import { LeadButton } from "@/components/forms/lead-button";
import type { Faq } from "@/data/seo";

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) { return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={item.href}>{index > 0 && <i aria-hidden="true">/</i>}{index === items.length - 1 ? item.label : <Link href={item.href}>{item.label}</Link>}</span>)}</nav>; }
export function FaqList({ faqs }: { faqs: Faq[] }) { return <section className="seo-faq" aria-labelledby="faq-title"><h2 id="faq-title">Common questions</h2>{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>; }
export function RelatedLinks({ links }: { links: { href: string; label: string }[] }) { return <aside className="related-links" aria-label="Explore more"><p className="section-label">Explore More</p>{links.map((link) => <Link href={link.href} key={link.href}>{link.label} <span aria-hidden="true">↗</span></Link>)}</aside>; }
export function JsonLd({ data }: { data: object }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />; }
const ctaCopy = {
  "private-presentation": { eyebrow: "Private Presentation", title: "Review the exact residence and current commercial terms.", body: "Request a dated, unit-specific presentation from the project team." },
  brochure: { eyebrow: "Current Brochure", title: "Request the latest authorised project material.", body: "Share your preferred configuration so the brochure can be provided with relevant current details." },
  "project-details": { eyebrow: "Current Project Details", title: "Continue with verified, unit-specific information.", body: "Request the latest available plan, specification and supporting project material." },
  "general-enquiry": { eyebrow: "Private Presentation", title: "Continue the conversation privately.", body: "Request current project details and a considered introduction from our advisory team." },
} as const;
export function SeoCta({ source, label, variant = "general-enquiry" }: { source: string; label: string; variant?: "private-presentation" | "brochure" | "project-details" | "general-enquiry" }) { const copy = ctaCopy[variant]; return <section className="seo-cta"><p className="section-label">{copy.eyebrow}</p><h2>{copy.title}</h2><p>{copy.body}</p><LeadButton source={source} variant={variant}>{label}</LeadButton></section>; }
