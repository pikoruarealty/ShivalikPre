import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { LeadProvider } from "@/components/forms/lead-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { publicConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/seo";
import "./globals.css";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display" });
export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Shivalik Présenté GIFT City | Riverfront Residences",
    description: "Explore Shivalik Présenté, a private collection of 4 BHK riverfront residences and 6 BHK duplex penthouses in GIFT City, Gandhinagar.",
  }),
  metadataBase: new URL(publicConfig.siteUrl),
  applicationName: "Shivalik Présenté",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { email: false, address: false, telephone: false },
  referrer: "origin-when-cross-origin",
  verification: publicConfig.googleSiteVerification ? { google: publicConfig.googleSiteVerification } : undefined,
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en-IN"><body className={`${manrope.variable} ${instrument.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><LeadProvider>{children}<SiteFooter /></LeadProvider></body></html>; }
