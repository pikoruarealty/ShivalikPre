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

## Vercel deployment

1. Import `BAPUx03/ShivalikPre` into Vercel. The framework is detected automatically as Next.js; use the repository root as the Root Directory and keep the default `npm run build` command.
2. The project is pinned to Node.js 22 through `package.json`. No custom output directory or static export setting is required.
3. In **Project Settings → Environment Variables**, add the values from `.env.example` for the environments you need. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` production domain.
4. Add the Supabase and Brevo variables from `.env.example` to Production and Preview. These are server-only secrets—never prefix them with `NEXT_PUBLIC_` and never commit their values.
5. Redeploy after editing environment variables. The enquiry endpoint intentionally returns a safe error until every lead-delivery variable is configured.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the verified production URL. Contact actions remain hidden until the verified phone, WhatsApp, and email variables are supplied.

## Lead delivery: Supabase + Brevo

1. Create a Supabase project, then run [the leads migration](supabase/migrations/20260907000000_create_leads.sql) in its SQL Editor (or apply it with the Supabase CLI). It creates `public.leads`, enables Row Level Security, and intentionally creates no public policies.
2. Copy the project URL and **service role** key into `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The service role key is used only by the server-side API route; never expose it to the browser.
3. In Brevo, verify the sender address you want to use, create an API key with transactional-email access, then set `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and optionally `BREVO_SENDER_NAME`.
4. Set `LEAD_ADMIN_EMAIL` to the inbox that should receive each new lead notification.

For every valid enquiry, the API sends an HTML and plain-text transactional email through Brevo. Once Supabase is configured, it stores the lead there first as well. It returns success only after the active delivery steps complete. Supabase’s REST endpoint is protected with its server-only secret key, while the browser talks only to `/api/leads`. This follows [Supabase’s REST API guidance](https://supabase.com/docs/guides/api) and [Brevo’s transactional email API](https://developers.brevo.com/docs/send-a-transactional-email).

## OTP verification

Leads require a verified Indian mobile number before they can be submitted. Add `TWO_FACTOR_API_KEY` and a random high-entropy `OTP_SESSION_SECRET` in the deployment environment. Both remain server-only; OTP provider session data is held in a short-lived, signed, HttpOnly cookie and the lead API verifies it again before delivery. The integration uses 2Factor’s OTP send and verification flow.

Analytics IDs are optional and must be configured only with the appropriate consent approach for the deployment context. Add the Google Search Console token only after verification is obtained.

## Images

Approved assets belong under `public/images/presente/`. Recommended files include `hero/presente-hero.webp`, exterior renders, interior living/bedroom/dining images, amenity images, `location/gift-city-01.webp`, and `public/images/og/presente-og.jpg`. Use WebP where possible: hero images around 2400×1350, landscape content around 1800×1200, and OG image 1200×630.
