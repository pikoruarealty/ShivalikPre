const input = process.argv[2] ?? process.env.NEXT_PUBLIC_SITE_URL;

if (!input) {
  console.error("Usage: npm run seo:audit -- https://your-domain.com");
  process.exit(1);
}

const siteUrl = new URL(input);
siteUrl.pathname = "";
siteUrl.search = "";
siteUrl.hash = "";
const origin = siteUrl.toString().replace(/\/$/, "");
const fetchOrigin = process.env.SEO_AUDIT_FETCH_ORIGIN
  ? new URL(process.env.SEO_AUDIT_FETCH_ORIGIN).origin
  : null;
const googlebot =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const fetchText = async (url) => {
  const requestedUrl = new URL(url);
  const fetchUrl = fetchOrigin
    ? new URL(`${requestedUrl.pathname}${requestedUrl.search}`, fetchOrigin)
    : requestedUrl;
  const response = await fetch(fetchUrl, {
    headers: { "user-agent": googlebot },
    redirect: "manual",
  });
  return { response, body: await response.text() };
};

const readTag = (html, pattern) => html.match(pattern)?.[1]?.trim() ?? "";
const failures = [];

const robotsUrl = `${origin}/robots.txt`;
const { response: robotsResponse, body: robots } = await fetchText(robotsUrl);
if (robotsResponse.status !== 200) {
  failures.push(`${robotsUrl} returned ${robotsResponse.status}`);
}
if (!/^User-Agent:\s*\*/im.test(robots) || !/^Allow:\s*\/$/im.test(robots)) {
  failures.push("robots.txt does not explicitly allow public crawling");
}
if (/^Disallow:\s*\/$/im.test(robots)) {
  failures.push("robots.txt blocks the entire site");
}
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) {
  failures.push("robots.txt does not advertise the canonical sitemap URL");
}

const sitemapUrl = `${origin}/sitemap.xml`;
const { response: sitemapResponse, body: sitemap } = await fetchText(sitemapUrl);
if (sitemapResponse.status !== 200) {
  failures.push(`${sitemapUrl} returned ${sitemapResponse.status}`);
}

const pageUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => !url.includes("/images/"));

if (pageUrls.length === 0) failures.push("sitemap.xml contains no page URLs");
if (new Set(pageUrls).size !== pageUrls.length) {
  failures.push("sitemap.xml contains duplicate page URLs");
}

const titles = new Map();
const descriptions = new Map();
const linkedPages = new Set();

for (const url of pageUrls) {
  const { response, body } = await fetchText(url);
  const canonical = readTag(
    body,
    /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
  );
  const robotsMeta = readTag(
    body,
    /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i,
  );
  const title = readTag(body, /<title>([^<]+)<\/title>/i);
  const description = readTag(
    body,
    /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
  );
  const h1Count = (body.match(/<h1(?:\s|>)/gi) ?? []).length;
  const hasStructuredData = /<script\s+[^>]*type=["']application\/ld\+json["']/i.test(body);

  for (const match of body.matchAll(/<a\s+[^>]*href=["']([^"'#]+)["']/gi)) {
    try {
      const linkedUrl = new URL(match[1], url);
      if (linkedUrl.origin === origin) linkedPages.add(linkedUrl.toString().replace(/\/$/, ""));
    } catch {
      failures.push(`${url} contains an invalid link: ${match[1]}`);
    }
  }

  if (response.status !== 200) failures.push(`${url} returned ${response.status}`);
  if (response.headers.has("x-robots-tag")) {
    failures.push(`${url} sends X-Robots-Tag: ${response.headers.get("x-robots-tag")}`);
  }
  if (/noindex|nofollow/i.test(robotsMeta)) {
    failures.push(`${url} has robots content "${robotsMeta}"`);
  }
  if (canonical !== url.replace(/\/$/, "")) {
    failures.push(`${url} has mismatched canonical "${canonical || "missing"}"`);
  }
  if (!title) failures.push(`${url} has no title`);
  if (!description) failures.push(`${url} has no meta description`);
  if (h1Count !== 1) failures.push(`${url} has ${h1Count} H1 elements instead of one`);
  if (!hasStructuredData) failures.push(`${url} has no JSON-LD structured data`);

  if (title) titles.set(title, [...(titles.get(title) ?? []), url]);
  if (description) {
    descriptions.set(description, [...(descriptions.get(description) ?? []), url]);
  }
}

for (const url of pageUrls) {
  if (url !== origin && !linkedPages.has(url.replace(/\/$/, ""))) {
    failures.push(`${url} has no crawlable internal link from another sitemap page`);
  }
}

for (const [title, urls] of titles) {
  if (urls.length > 1) failures.push(`Duplicate title on ${urls.join(", ")}: ${title}`);
}
for (const [description, urls] of descriptions) {
  if (urls.length > 1) {
    failures.push(`Duplicate description on ${urls.join(", ")}: ${description}`);
  }
}

console.log(`SEO audit checked ${pageUrls.length} sitemap URLs at ${origin}.`);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("PASS: crawling, index directives, canonicals, and core metadata are valid.");
