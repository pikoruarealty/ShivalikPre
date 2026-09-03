# Shivalik Présenté

Next.js website for Shivalik Présenté in GIFT City.

## Setup

Requires Node.js 22+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Run `npm run typecheck`, `npm run lint`, and `npm run build` before deployment.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the verified production URL. Contact actions remain hidden until the verified phone, WhatsApp, and email variables are supplied. `LEAD_WEBHOOK_URL` is server-only; without it, the enquiry API safely returns an unconfigured response instead of claiming delivery.

Analytics IDs are optional and must be configured only with the appropriate consent approach for the deployment context. Add the Google Search Console token only after verification is obtained.

## Images

Approved assets belong under `public/images/presente/`. Recommended files include `hero/presente-hero.webp`, exterior renders, interior living/bedroom/dining images, amenity images, `location/gift-city-01.webp`, and `public/images/og/presente-og.jpg`. Use WebP where possible: hero images around 2400×1350, landscape content around 1800×1200, and OG image 1200×630.
