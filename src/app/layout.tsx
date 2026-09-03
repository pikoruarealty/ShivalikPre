import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { LeadProvider } from "@/components/forms/lead-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { publicConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/seo";
import "./globals.css";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display" });
export const metadata: Metadata = { ...createPageMetadata({ title: "Shivalik Présenté GIFT City | Ultra Luxury Riverfront Residences", description: "Discover Shivalik Présenté, an ultra-luxury boutique collection of riverfront residences in GIFT City, Gandhinagar." }), ...(publicConfig.siteUrl ? { metadataBase: new URL(publicConfig.siteUrl) } : {}), title: { default: "Shivalik Présenté", template: "%s | Shivalik Présenté" }, verification: publicConfig.googleSiteVerification ? { google: publicConfig.googleSiteVerification } : undefined };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${manrope.variable} ${instrument.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><LeadProvider>{children}<SiteFooter /></LeadProvider></body></html>; }
