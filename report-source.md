# Shivalik Présenté SEO implementation report

Audience: website owner and development team  
Date: 2026-09-08  
Scope: technical crawlability and indexing, page metadata, structured data, image discoverability, landing-page quality, and the `/insights` publication area. India and English-language search are assumed. This work does not include backlink acquisition, Google Business Profile management, Search Console access, or a ranking guarantee.

## Executive answer

The previous implementation had two critical technical defects: without `NEXT_PUBLIC_SITE_URL`, it generated an empty sitemap and omitted canonical and absolute social URLs; the homepage also rendered a short brand-only title instead of the intended descriptive title. Most guide pages and every insight article reused near-identical copy, weakening the reason to index each URL independently. Project imagery was implemented as CSS backgrounds, which made those images less directly discoverable as page images.

The implementation now produces 28 indexable canonical URLs, unique titles and descriptions, one visible H1 per indexable page, crawlable internal links, server-rendered content, actual `<img>` elements, and route-appropriate JSON-LD. Utility policies are `noindex` and excluded from the sitemap. Production builds use `NEXT_PUBLIC_SITE_URL` first and Vercel's production hostname as a deployment fallback.

## Evidence-based decisions

- Every page uses concise, page-specific title and visible H1 text. Google identifies the title element, main visual title, headings, Open Graph title, and link text as title-link inputs, and recommends descriptive, concise, non-boilerplate titles ([Google Search Central, “Influencing your title links,” accessed 2026-09-08](https://developers.google.com/search/docs/appearance/title-link)).
- Every indexable URL has a unique meta description and substantial visible content. Google primarily creates snippets from page content and may use the meta description when it better describes the page ([Google Search Central, “Control your snippets,” accessed 2026-09-08](https://developers.google.com/search/docs/appearance/snippet)).
- Canonical HTML annotations, sitemap URLs, and internal links consistently use the preferred URL. Google treats redirects and `rel=canonical` as strong signals and sitemap inclusion as a weaker reinforcing signal ([Google Search Central, “Consolidate duplicate URLs,” accessed 2026-09-08](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).
- The sitemap contains only canonical, indexable pages and accurate significant-update dates. Google requires absolute sitemap URLs, ignores priority/change-frequency values, and uses last-modified dates only when they are consistently accurate ([Google Search Central, “Build and submit a sitemap,” accessed 2026-09-08](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).
- Content and links are present in prerendered HTML. Google recommends server-side or prerendering for users and crawlers and discovers standard anchors with `href` attributes ([Google Search Central, “JavaScript SEO basics,” accessed 2026-09-08](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics); [Google Search Central, “Link best practices,” accessed 2026-09-08](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)).
- JSON-LD describes only visible page content and uses WebSite, Organization, ApartmentComplex, WebPage, CollectionPage, ItemList, BlogPosting, BreadcrumbList, and visible FAQ entities. This follows the requirement that structured data represent visible content and not mislead users ([Google Search Central, “General structured data guidelines,” updated 2026-07-10](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)).
- Project-level factual language was limited to claims already in supplied project data or corroborated by Shivalik Group's project page, which describes 54 residences and riverfront-facing views ([Shivalik Group, “Présenté,” accessed 2026-09-08](https://shivalikgroup.com/projects/presente)). Exact unit area definitions and availability remain explicitly subject to current project documents.

## Verification

- `npm run typecheck`: passed.
- ESLint across all changed application and SEO files: passed.
- `npm run build`: passed with Next.js 16.3.4; 39 static pages generated.
- Local production crawl: 28 sitemap URLs; zero missing titles, descriptions, canonicals, H1s, or JSON-LD; zero duplicate titles or descriptions; every canonical matched its sitemap URL.
- Unknown route returned HTTP 404. Privacy and disclaimer pages returned `noindex, nofollow` and were absent from the sitemap.

## Remaining deployment actions

Set `NEXT_PUBLIC_SITE_URL` to the final canonical custom domain before the production build. If deploying on Vercel without a custom-domain variable, the code uses `VERCEL_PROJECT_PRODUCTION_URL`; explicit configuration is still preferred. Add the Google Search Console verification token, deploy, submit `/sitemap.xml`, inspect representative URLs, and request indexing. Ranking and indexing remain search-engine decisions and cannot be guaranteed by technical changes alone.

## Claim-to-source ledger

| Claim family | Primary source | Confidence | Notes |
|---|---|---:|---|
| Titles and title links | Google Search Central title-link documentation | High | Current guidance; accessed 2026-09-08 |
| Snippets and descriptions | Google Search Central snippet documentation | High | Current guidance; accessed 2026-09-08 |
| Canonicals | Google Search Central canonical documentation | High | Current guidance; accessed 2026-09-08 |
| Sitemap construction | Google Search Central sitemap documentation | High | Current guidance; accessed 2026-09-08 |
| Rendered HTML and links | Google Search Central JavaScript and link documentation | High | Current guidance; accessed 2026-09-08 |
| Structured data policy | Google Search Central structured-data guidelines | High | Updated 2026-07-10 |
| Core project identity | Shivalik Group project page and repository project data | Medium-high | Exact unit documents were not available; caveats retained |
