import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/seo-ui";
import { Reveal } from "@/components/ui/reveal";
import { AmenitiesGallery } from "@/components/sections/amenities-gallery";
import { AmenitiesIntro } from "@/components/sections/amenities-intro";
import { BlogPreview } from "@/components/sections/blog-preview";
import { ConnectivitySection } from "@/components/sections/connectivity-section";
import { FourBhkSection } from "@/components/sections/four-bhk-section";
import { GiftCitySection } from "@/components/sections/gift-city-section";
import { Hero } from "@/components/sections/hero";
import { InteriorLifeSection } from "@/components/sections/interior-life-section";
import { InvestmentSection } from "@/components/sections/investment-section";
import { LeisureSection } from "@/components/sections/leisure-section";
import { LocationAdvantageSection } from "@/components/sections/location-advantage-section";
import { LocationCtaSection } from "@/components/sections/location-cta-section";
import { LocationMapSection } from "@/components/sections/location-map-section";
import { OpenSpacesSection } from "@/components/sections/open-spaces-section";
import { PenthouseSection } from "@/components/sections/penthouse-section";
import { PrivacySection } from "@/components/sections/privacy-section";
import { ProjectFaqSection } from "@/components/sections/project-faq-section";
import { ProjectIntroduction } from "@/components/sections/project-introduction";
import { ProjectNumbers } from "@/components/sections/project-numbers";
import { ResidencesIntro } from "@/components/sections/residences-intro";
import { RiverfrontSection } from "@/components/sections/riverfront-section";
import { SeoDiscoverySection } from "@/components/sections/seo-discovery-section";
import { SocialSection } from "@/components/sections/social-section";
import { TowersSection } from "@/components/sections/towers-section";
import { VistaDeckSection } from "@/components/sections/vista-deck-section";
import { VolumeSection } from "@/components/sections/volume-section";
import { WellnessSection } from "@/components/sections/wellness-section";
import { websiteSchema } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shivalik Présenté GIFT City | 4 BHK Luxury Apartments",
  description: "Explore Shivalik Présenté in GIFT City, Gandhinagar: 54 riverfront homes with large 4 BHK residences and limited 6 BHK duplex penthouses.",
});

export default function HomePage() {
  return <><SiteHeader /><main><JsonLd data={websiteSchema()} /><Hero /><Reveal variant="text"><ProjectIntroduction /></Reveal><Reveal variant="list"><ProjectNumbers /></Reveal><Reveal variant="list"><PrivacySection /></Reveal><Reveal variant="image"><RiverfrontSection /></Reveal><Reveal variant="list"><TowersSection /></Reveal><Reveal variant="image"><VistaDeckSection /></Reveal><Reveal variant="text"><ResidencesIntro /></Reveal><Reveal variant="image"><FourBhkSection /></Reveal><Reveal variant="image"><PenthouseSection /></Reveal><Reveal variant="line"><VolumeSection /></Reveal><Reveal variant="list"><InteriorLifeSection /></Reveal><Reveal variant="text"><AmenitiesIntro /></Reveal><Reveal variant="image"><WellnessSection /></Reveal><Reveal variant="list"><LeisureSection /></Reveal><Reveal variant="list"><SocialSection /></Reveal><Reveal variant="list"><OpenSpacesSection /></Reveal><Reveal variant="image"><AmenitiesGallery /></Reveal><Reveal variant="image"><GiftCitySection /></Reveal><Reveal variant="list"><ConnectivitySection /></Reveal><Reveal variant="list"><LocationAdvantageSection /></Reveal><Reveal variant="text"><InvestmentSection /></Reveal><Reveal variant="list"><SeoDiscoverySection /></Reveal><Reveal variant="list"><ProjectFaqSection /></Reveal><Reveal variant="list"><BlogPreview /></Reveal><Reveal variant="line"><LocationMapSection /></Reveal><Reveal variant="text"><LocationCtaSection /></Reveal></main></>;
}
