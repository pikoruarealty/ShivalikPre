import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const input = process.argv[2] ?? process.env.NEXT_PUBLIC_SITE_URL;
if (!input) {
  console.error("Usage: npm run seo:checklist -- https://your-domain.com");
  process.exit(1);
}

const canonicalOrigin = new URL(input).origin;
const fetchOrigin = process.env.SEO_AUDIT_FETCH_ORIGIN
  ? new URL(process.env.SEO_AUDIT_FETCH_ORIGIN).origin
  : canonicalOrigin;

const fetchHtml = async (canonicalUrl) => {
  const target = new URL(canonicalUrl);
  const response = await fetch(new URL(`${target.pathname}${target.search}`, fetchOrigin), {
    headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  });
  return { response, html: await response.text() };
};

const text = (value = "") => value
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&mdash;|&#x2014;/g, "—")
  .replace(/&ndash;|&#x2013;/g, "–")
  .replace(/\s+/g, " ")
  .trim();
const match = (html, expression) => text(html.match(expression)?.[1]);
const cell = (value) => String(value || "—").replaceAll("|", "\\|").replaceAll("\n", " ");

const sitemapResponse = await fetch(new URL("/sitemap.xml", fetchOrigin));
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((item) => item[1])
  .filter((url) => !url.includes("/images/"));

const rows = [];
for (const url of urls) {
  const { response, html } = await fetchHtml(url);
  const title = match(html, /<title>([^<]+)<\/title>/i);
  const h1 = match(html, /<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i);
  const canonical = match(html, /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const robots = match(html, /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
  const schemaTypes = [...html.matchAll(/"@type":"([^"]+)"/g)].map((item) => item[1]);
  const internalLinks = [...html.matchAll(/<a\s+[^>]*href=["']([^"'#]+)["']/gi)]
    .map((item) => new URL(item[1], url))
    .filter((item) => item.origin === canonicalOrigin)
    .map((item) => item.pathname)
    .filter((path, index, all) => path !== new URL(url).pathname && all.indexOf(path) === index);
  const ctas = [...html.matchAll(/<button[^>]*class=["'][^"']*lead-button[^"']*["'][^>]*>([\s\S]*?)<\/button>/gi)]
    .map((item) => text(item[1]));
  const ctaText = ctas.join(", ");
  const events = ["page_view"];
  if (ctas.length) events.push("cta_click", "form_start", "form_submit", "lead_form_success");
  if (/brochure/i.test(ctaText)) events.push("brochure_request");
  if (/price/i.test(ctaText)) events.push("price_request");
  if (/floor\s*plan/i.test(ctaText)) events.push("floorplan_request");
  if (/presentation/i.test(ctaText)) events.push("private_presentation_request");

  rows.push([
    new URL(url).pathname || "/",
    title.split("|")[0].trim(),
    title,
    h1,
    canonical,
    response.ok && !/noindex/i.test(robots) ? "Index" : `Check (${response.status})`,
    [...new Set(schemaTypes)].join(", "),
    internalLinks.slice(0, 6).join(", ") + (internalLinks.length > 6 ? ` (+${internalLinks.length - 6})` : ""),
    ctaText,
    [...new Set(events)].join(", "),
  ]);
}

const header = ["URL", "Target intent", "Title", "H1", "Canonical", "Index status", "Schema", "Internal links", "CTA", "Analytics events"];
const markdown = [
  "# SEO release checklist",
  "",
  `Generated ${new Date().toISOString()} from ${canonicalOrigin}.`,
  "",
  `Pages checked: ${rows.length}. This inventory is generated from the XML sitemap and rendered Googlebot HTML.`,
  "",
  `| ${header.join(" | ")} |`,
  `| ${header.map(() => "---").join(" | ")} |`,
  ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  "",
  "## Release gates",
  "",
  "- [ ] Verify developer-approved price, RERA, possession and construction data before publishing values.",
  "- [ ] Test structured data in Google Rich Results Test and Schema.org Validator.",
  "- [ ] Test mobile layouts and Core Web Vitals on priority templates.",
  "- [ ] Confirm GA4/GTM events in DebugView and submit the sitemap in Search Console.",
  "- [ ] Confirm canonical-host redirects and remove or noindex any staging deployment.",
  "",
].join("\n");

const output = resolve("SEO_URL_CHECKLIST.md");
await writeFile(output, markdown, "utf8");
console.log(`Wrote ${rows.length} URL checks to ${output}`);
