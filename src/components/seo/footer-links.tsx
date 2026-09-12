import Link from "next/link";

const groups = [
  {
    title: "Project",
    links: [
      ["/shivalik-presente", "Présenté"],
      ["/shivalik-presente-gift-city", "Project Guide"],
      ["/shivalik-presente-4-bhk", "Residences"],
      ["/shivalik-presente-amenities", "Amenities"],
      ["/shivalik-presente-location", "Location"],
    ],
  },
  {
    title: "GIFT City",
    links: [
      ["/property-in-gift-city", "Property Guide"],
      ["/gift-city-real-estate-investment", "Investment"],
      ["/gift-city-for-nri-buyers", "NRI Buyers"],
      ["/luxury-apartments-gift-city", "Luxury Apartments"],
      ["/luxury-homes-gift-city", "Luxury Homes"],
      ["/luxury-apartments-for-sale-gift-city", "Apartments for Sale"],
      ["/ultra-luxury-apartments-gift-city", "Ultra-Luxury Homes"],
      ["/4-bhk-apartments-gift-city", "4 BHK in GIFT City"],
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
