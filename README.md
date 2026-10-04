# Fieldplan — Landscape Material Planning

Next.js App Router, TypeScript and Tailwind project in the repository root. Gravel is the only available calculator.

## Current scope

- Rectangle/circle geometry with mixed units and transparent breakdowns.
- Editable density, extra allowance, existing stock, remaining volume and estimated weight.
- Bag vs bulk entered-price comparison, supplier minimums/increments, delivery and leftovers.
- Final project plan, clipboard copy and browser print. No accounts, storage, live prices, advertising or analytics.
- Static explanatory content, centralized metadata, canonical URLs, sitemap/robots, conservative JSON-LD and SEO regression tests.
- Contact is a non-sending preview. Privacy/terms need operator and hosting review. These three routes deliberately use noindex/follow and are excluded from the production sitemap.

Parts 1–5 calculation logic is unchanged by Part 6. See [SEO audit and intent map](docs/seo-audit.md) and [launch/Search Console handoff](docs/launch-checklist.md).

## Local setup

Use Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Local development needs no production domain. Without SITE_URL, no canonical or URL-based schema is invented. Development and preview pages are noindex, with an empty sitemap. Robots permits crawling so crawlers can see the indexing directive.

## Release checks

```sh
npx playwright install chromium
npm run verify
```

This runs lint, route type generation, TypeScript, a production build and every Playwright test. It uses SITE_URL if supplied; otherwise it uses the reserved **test fixture** https://fieldplan.test to validate production metadata locally. The address is not a proposed domain and is never contacted. **Do not deploy this verification build. Rebuild with the real production origin.** Tests run against localhost while verifying the configured HTTPS metadata. Stop other servers on port 3000; the runner refuses to reuse them.

Individual commands remain available:

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

A production build deliberately fails without SITE_URL. For a non-public review build, set SITE_MODE=preview before build and start. It can omit SITE_URL, producing no canonical, URL-based schema or sitemap entries. When running tests individually, use the same SITE_MODE and SITE_URL as the build.

## Production configuration

Set SITE_MODE=production and SITE_URL to the actual owned HTTPS origin **before building**. No path, query, credentials or custom port is accepted. A trailing slash is normalized. Missing origins, localhost/IP addresses, HTTP and common placeholder domains fail production builds. There is no provider URL or request-host fallback.

Canonicals, social URLs, schema, sitemap and robots share lib/site.ts. Configure host-level redirects from alternate hostnames and HTTP to the selected origin. Rebuild after changing origin or indexing mode. See .env.example.

No deployment platform or production origin is recorded in the repository. A successful local build is not a deployment. Follow the [launch checklist](docs/launch-checklist.md) once those details are available.

## Structure

```text
app/                    Static pages, layout, metadata routes and styles
components/calculator/  Existing Parts 1–5 calculator and final plan
components/seo/         Server-rendered JSON-LD
lib/calculations/       Pure geometry, material and purchase math
lib/units/              Exact unit definitions
lib/materials/          Centralized planning density presets
lib/project/            Final-plan presentation/export helpers
lib/site-config.ts      Environment/origin validation
lib/site.ts             Routes, indexing policy and metadata
scripts/                Repeatable release verification
tests/                  Calculation, browser, accessibility and SEO tests
docs/                   Audit, intent map and launch handoff
```

System fonts and inline SVGs avoid external font/image requests. No SEO client dependency or third-party script was added. Add future calculator routes to the central registry only after they are implemented and useful; no keyword-variant pages are generated.
