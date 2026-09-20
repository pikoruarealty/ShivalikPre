# Shivalik Presente SEO launch runbook

Use this after the production deployment is live. Account ownership, DNS access and verified business information are required for the external steps.

## 1. Verify the live deployment

- Confirm the production domain uses HTTPS and redirects every HTTP/non-canonical hostname to the preferred hostname.
- Open `/robots.txt`, `/sitemap.xml`, `/project-facts`, `/editorial-policy` and the fact-sheet PDF.
- Confirm the old duplicate URLs return permanent redirects to their intended destination.
- Submit a real enquiry and verify OTP, database/email delivery and the success state.
- Run PageSpeed Insights on the home page, 4 BHK page, 6 BHK page, project-facts page and one article on mobile and desktop.

## 2. Google Search Console

1. Create a Domain property for the production domain and verify it with the DNS TXT record. Domain verification is preferred because it covers protocol and subdomain variants.
2. If URL-prefix verification is used instead, copy Google's HTML-tag token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in the hosting environment and redeploy.
3. Submit `https://www.shivalikpresente.com/sitemap.xml` under **Sitemaps**.
4. Use **URL inspection** on the home page, `/4-bhk-apartments-gift-city`, `/6-bhk-penthouse-gift-city`, `/project-facts` and the four priority articles. Test the live URL, then request indexing.
5. Check **Pages**, **Sitemaps**, **Core Web Vitals**, **HTTPS**, **Manual actions** and **Security issues** weekly during the first month.
6. Do not request indexing repeatedly. Correct the reported cause and request again only after a material fix.

## 3. GA4 or Google Tag Manager

- Preferred managed setup: create a GTM web container, set `NEXT_PUBLIC_GTM_ID`, publish a GA4 Configuration tag and keep `NEXT_PUBLIC_GA4_ID` blank to avoid duplicate measurement.
- Simpler setup: set `NEXT_PUBLIC_GA4_ID` and leave GTM blank. The website loads direct GA4 only when GTM is absent.
- Implement the approved consent approach before activating non-essential analytics or advertising tags.
- In GA4, mark `lead_form_success` as the primary conversion. Review `whatsapp_click`, `phone_click`, `brochure_request`, `floor_plan_request`, `factsheet_download`, `site_visit_request` and `map_directions_click` as supporting events.
- Test events in Tag Assistant and GA4 DebugView, including internal navigation and mobile sticky CTAs.

## 4. Structured data and crawling

- Test the home page, a configuration page, an insight article and `/project-facts` in Google's Rich Results Test.
- Validate the complete JSON-LD graph with Schema.org Validator. `RealEstateListing` is semantic markup and does not guarantee a Google rich result.
- Confirm every schema claim is visible on the page and supported by the same dated source.

## 5. Google Business Profile

- Create a profile only if there is a real, staffed sales/leasing office that meets customers during stated hours and has permanent signage. A for-sale property or lead-generation-only operation is not independently eligible.
- Use the exact real-world business name, verified phone, website, office address and hours. Do not add keywords to the business name.
- Add current office/project photography and obtain genuine reviews without incentives. Reply professionally to every review.

## 6. Property portals and NAP

- Claim or create authorised listings on 99acres, MagicBricks, Housing.com and NoBroker.
- Use one approved syndication sheet for project name, configuration, measurement basis, RERA record, possession, address, contact details, source date and disclaimer.
- Correct existing portal conflicts, especially any unsupported 3 BHK reference and incompatible carpet/RA labels.
- Keep the same verified name, address, phone and website wherever the business is listed. Audit JustDial, Sulekha and IndiaMART monthly.

## 7. Ongoing SEO operations

- Weekly: check indexing, crawl errors, lead delivery, spam and broken links.
- Monthly: review Search Console queries/pages, conversion rate, Core Web Vitals, portal consistency and review responses.
- Quarterly: publish a dated price-trend update only when the evidence set and methodology support it; update project facts and the downloadable fact sheet when official information changes.
- Record every material factual correction with its source and review date.
