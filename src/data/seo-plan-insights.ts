import type { ContentSection, Insight } from "@/data/seo";
import { projectFacts } from "@/data/project-facts";

const section = (title: string, ...body: string[]): ContentSection => ({ title, body });
const relatedPages = [
  { href: "/project-facts", label: "Verified Présenté facts" },
  { href: "/large-format-residences-gift-city", label: "Large-format residence guide" },
  { href: "/shivalik-presente-price", label: "Price and complete cost guide" },
];

const shivalikSources = [
  { href: projectFacts.sources.officialProject, label: "Shivalik Group — official Présenté project page" },
  { href: projectFacts.sources.officialPocketDocument, label: "Shivalik Group — published project document" },
];

export const seoPlanInsights: Insight[] = [
  {
    slug: "shivalik-presente-vs-savvy-marina",
    title: "Shivalik Présenté vs Savvy Marina: Riverfront Buyer Comparison",
    description: "Compare Shivalik Présenté and Savvy Marina in GIFT City through waterfront positioning, home formats, privacy, amenities and unit-level diligence.",
    category: "Comparisons",
    publishedDate: "2026-09-30",
    updatedDate: "2026-09-30",
    excerpt: "Both projects use a waterfront lifestyle proposition, but the useful decision comes from comparing the exact residence, planning, density and ownership terms.",
    sections: [
      section("Begin with the shared waterfront context", "Shivalik Présenté and Savvy Marina are both presented by their developers around GIFT City waterfront living. That common headline does not make the exact views equivalent.", "For each available home, record the tower, floor, orientation, sightline, balcony or terrace arrangement, sun, glare, wind and any known development between the residence and the river."),
      section("Compare the home formats", "Shivalik’s published material describes a 54-home collection comprising large-format 4 BHK residences and three 6 BHK duplex penthouses. Savvy Group’s official Marina page presents apartments as well as duplex and penthouse formats with private-pool and wide-balcony messaging.", "Request current, dimensioned plans from both projects. Compare statutory area, room sizes, circulation, storage, service movement and the legal status of any terrace, pool, foyer or other space represented as exclusive."),
      section("Privacy and community scale", "Présenté’s proposition emphasises limited residence count, private lift foyers and no-common-wall planning. For Marina, ask for the current total residence count, homes per floor, lift strategy and entrance relationships from authorised project documents.", "A smaller collection and a broader apartment community can offer different social, service and maintenance experiences. Decide which operating model fits the household instead of treating density as a score by itself."),
      section("Compare amenities by capacity and operation", "Savvy’s official project material highlights an infinity pool, club and lounge, spa and private theatre. Présenté’s stated programme also includes pool, wellness, fitness, cinema, social and landscaped spaces.", "Ask what is approved, included at handover and currently under construction; then compare facility capacity, booking rules, staffing, guest use and recurring maintenance cost."),
      section("Finish with exact-unit evidence", "For both projects, verify registration disclosures, current construction information, possession terms, the exact plan, area basis, specification, parking, complete cost and agreement. Use independent legal and technical advice before paying."),
    ],
    faqs: [
      { question: "Which project is better for waterfront living?", answer: "That depends on the exact residence and buyer priorities. Compare the verified view, plan, privacy, amenities, project stage, documents and complete cost rather than relying on the shared waterfront label." },
      { question: "Can published area figures be compared directly?", answer: "Only when the area definitions match. Request the statutory area statement and dimensioned plan for each exact residence." },
      { question: "Are prices compared here?", answer: "No. Current unit-level price statements were not verified for both projects on the same date and basis. Request dated, itemised offers before comparing cost." },
    ],
    relatedPages,
    sources: [
      ...shivalikSources,
      { href: "https://savvygroup.in/savvy-marina/", label: "Savvy Group — official Marina project page" },
      { href: projectFacts.sources.gujaratRera, label: "Gujarat RERA" },
    ],
  },
  {
    slug: "shivalik-presente-vs-siban",
    title: "Shivalik Présenté vs SIBAN: GIFT City Buyer Comparison",
    description: "Compare Shivalik Présenté and SIBAN in GIFT City through project format, configurations, amenities, privacy and current buyer verification.",
    category: "Comparisons",
    publishedDate: "2026-09-30",
    updatedDate: "2026-09-30",
    excerpt: "Présenté is positioned as a limited large-format riverfront collection, while SIBAN presents a broader mixed-use and amenity-led residential ecosystem.",
    sections: [
      section("The projects begin with different formats", "Shivalik Présenté is presented as a boutique 54-home riverfront collection. SIBAN’s official website describes a next-generation mixed-use development combining residences, penthouses and retail with a large shared amenity programme.", "This is a choice between different residential propositions, not simply two versions of the same apartment product. Confirm the current registered phase and inventory for each project."),
      section("Compare the configuration range", "Présenté’s published mix is focused on large-format 4 BHK residences and three 6 BHK duplex penthouses. SIBAN’s official site currently lists residences from studio to 2.5 BHK and duplex penthouses from 1 to 4 BHK.", "Use the exact plan and statutory area statement. Bedroom labels and broader published area measures do not establish usable equivalence."),
      section("Low density versus a broader ecosystem", "Présenté emphasises limited homes, private arrival and no-common-wall planning. SIBAN highlights more than 60 amenities across a stated one lakh square feet and a mixed-use environment.", "Buyers who prioritise fewer neighbours may evaluate the projects differently from buyers who want a broader shared programme. Compare homes per floor, lift sharing, access control, service movement, facility capacity and maintenance."),
      section("Do not compare offers in isolation", "SIBAN’s official site currently promotes a payment offer, but promotional terms and eligibility can change. Présenté pricing is not published on this website without a verified, dated unit-level statement.", "Request complete cost sheets from both projects on the same date, including area basis, taxes, parking, deposits, premiums, payment milestones and validity. Review any special offer against the agreement and cancellation terms."),
      section("Complete the same diligence for both", "Verify the legal promoter, registration and phase, construction updates, possession information, exact residence, specification, parking, complete cost and agreement. Treat developer pages as primary marketing sources and statutory records as a separate verification layer."),
    ],
    faqs: [
      { question: "What is the main difference between Présenté and SIBAN?", answer: "Présenté is positioned as a limited large-format riverfront residential collection; SIBAN presents a broader mixed-use development with a wider configuration and amenity range." },
      { question: "Does SIBAN have the same configurations as Présenté?", answer: "No. Their official pages describe different configuration ranges. Confirm current registered inventory directly with each project." },
      { question: "Which offer is less expensive?", answer: "This page does not rank current cost because comparable unit-level offers were not verified on the same date and area basis. Request dated, itemised commercial statements." },
    ],
    relatedPages,
    sources: [
      ...shivalikSources,
      { href: "https://sibanatgift.com/", label: "SIBAN — official project website" },
      { href: projectFacts.sources.gujaratRera, label: "Gujarat RERA" },
    ],
  },
];
