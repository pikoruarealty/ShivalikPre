import Link from "next/link";

const groups = [
  {
    title: "Project",
    links: [
      ["/", "Présenté"],
      ["/shivalik-presente-gift-city", "Project Guide"],
      ["/project-facts", "Verified Project Facts"],
      ["/4-bhk-apartments-gift-city", "4 BHK Residences"],
      ["/6-bhk-penthouse-gift-city", "6 BHK Duplex Penthouses"],
      ["/shivalik-presente-floor-plan", "Floor Plans"],
      ["/shivalik-presente-amenities", "Amenities"],
      ["/shivalik-presente-location", "Location"],
    ],
  },
  {
    title: "GIFT City",
    links: [
      ["/property-in-gift-city", "Property Guide"],
      ["/guides", "All Property Guides"],
      ["/gift-city-real-estate-investment", "Investment"],
      ["/gift-city-for-nri-buyers", "NRI Buyers"],
      ["/luxury-apartments-gift-city", "Luxury Apartments"],
      ["/4-bhk-apartments-gift-city", "4 BHK in GIFT City"],
      ["/luxury-apartments-gandhinagar", "Luxury Apartments in Gandhinagar"],
      ["/4-bhk-apartments-gandhinagar", "4 BHK in Gandhinagar"],
      ["/riverfront-apartments-gift-city", "Riverfront Living"],
    ],
  },
  {
    title: "Insights",
    links: [
      ["/insights", "Latest Guides"],
      ["/insights/luxury-real-estate-gift-city-investment", "Investment Guide"],
      ["/insights/buying-luxury-apartment-gift-city", "Buyer Guide"],
      ["/insights/shivalik-presente-vs-sobha-elysia", "Présenté vs SOBHA Elysia"],
      ["/insights/gift-city-property-price-trends-q3-2026", "Q3 2026 Price Trends"],
      ["/editorial-policy", "Editorial Policy"],
      ["/privacy", "Privacy"],
      ["/disclaimer", "Disclaimer"],
    ],
  },
] as const;

export function FooterLinks() {
  return (
    <nav className="footer-links" aria-label="Footer navigation">
      {groups.map((group) => (
        <div key={group.title}>
          <p>{group.title}</p>
          {group.links.map(([href, label]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
