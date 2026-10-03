# Fieldplan — Landscape Material Planning

Parts 1 and 2 of the Landscape Material Planning & Cost Tools project. A lightweight Next.js App Router, TypeScript and Tailwind CSS foundation, initialized in the repository root, with a working geometric gravel volume calculator.

## Current scope

- Responsive homepage and shared navigation/footer.
- Gravel volume calculator: rectangles and circles with independent feet, inches, meters or centimeters for each measurement; inline validation, reset, results in ft³/yd³/m³ and a transparent formula breakdown.
- Contact **preview only**: no backend, storage, request or success message. Implicit form submission is prevented.
- About, methodology and draft legal pages. No weight, density, allowance, pricing, buying plans, accounts, database, APIs, analytics, advertising, AdSense or export integrations.
- Server Components by default. The calculator, mobile menu and contact submission prevention use client components.

Part 3 has not been implemented. The contact page remains a non-sending preview and future tool cards remain inactive.

## Volume calculation

All lengths are converted to meters using centralized exact definitions: ft = 0.3048 m, in = 0.0254 m, cm = 0.01 m. Rectangle volume is length × width × depth; circle volume is π × (diameter ÷ 2)² × depth. Cubic feet and yards are derived from cubic meters using the exact foot definition and 27 ft³ per yd³. No intermediate values are rounded.

The UI displays ft³ and yd³ to 2 decimal places and m³ to 3. Very small positive results use a less-than marker instead of a misleading zero; very large results use scientific notation. Empty, malformed, zero, negative and non-finite inputs are rejected. Numerical overflow or underflow produces a clear range error, never an invalid result. Shape, measurement and unit changes invalidate old results. Project type is context only.

Calculation and conversion functions are pure and independent of React. Values are processed in the browser without requests or persistent storage. See `lib/calculations/volume.ts` and `lib/units/conversions.ts`.

## Local setup

Use Node.js 20.9 or newer and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. System fonts are used; no external font or image requests are required.

## Checks

```sh
npm run lint
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

The Playwright suite starts the production server after a build. If using an installed Chrome browser, set `PLAYWRIGHT_CHANNEL=chrome` instead of downloading Chromium. `tests/volume.spec.ts` tests the pure functions without a browser fixture. `tests/calculator.spec.ts` covers the supplied imperial/metric/decimal examples, circle calculations, invalid inputs, overflow, reset, stale results, context-only project types, browser-only computation and accessible results/errors at 375, 768, 1024 and 1440px. `tests/foundation.spec.ts` preserves the Part 1 regression checks for routes, navigation, contact preview, metadata, sitemap/robots, keyboard focus and automated WCAG A/AA checks.

Dependency audit on October 3, 2026: `npm audit --omit=dev` reports zero vulnerabilities. The full audit reports five high-severity entries from one transitive `braces` advisory in the Next.js ESLint toolchain (`eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`). The latest published `braces` version, 3.0.3, is affected; there is no patched release available in the registry at this check. The suggested automatic fix downgrades the Next.js lint configuration to an incompatible older major and was not applied. Track [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and update the development toolchain when a compatible fix becomes available. This dependency is not shipped in the production application.

## Routes

`/`, `/gravel-calculator`, `/about`, `/contact`, `/methodology`, `/privacy-policy`, `/terms`, `/disclaimer`

“Tools” and “Guides” link to real homepage sections. Future tool cards have no links or routes. Unrecognized routes return a 404 page.

## Structure

```text
app/                    Pages, metadata routes and global design tokens
components/layout/      Header, Footer, ContentPage and Breadcrumb
components/ui/          Container, Button, ButtonLink, SectionHeading, Icon, PreviewForm
components/home/        ToolCard and original SVG ProjectSketch
components/calculator/  Interactive GravelShell and VolumeResults
lib/calculations/       Pure geometric volume, validation and display helpers
lib/units/              Centralized conversion constants and functions
lib/site.ts             Site identity, origin, route list and metadata helper
tests/                  Production browser acceptance tests
```

## Before public deployment

Set `SITE_URL` to the actual public origin (for example, `https://your-owned-domain.com`) **before building**. Canonicals, sitemap URLs and robots sitemap location are generated from this value. The default is `http://localhost:3000`; it is deliberately not an invented production domain. See `.env.example`.

The temporary brand is **Fieldplan**. Legal pages are explicitly drafts. Supply the operator and working privacy contact details, confirm hosting practices, and review the drafts before a public launch. Update privacy disclosures before introducing Google Analytics, Google AdSense, cookies, consent management or any data collection.

Open Graph metadata can be added centrally through `pageMetadata` in `lib/site.ts` after a real domain and social assets are available. There are no fabricated prices, testimonials, credentials or social profiles.

## Design and accessibility

Cream surfaces, forest-green accents, readable system typography, reusable tokens, visible focus outlines, a skip link, semantic landmarks, associated form labels, native controls and an Escape-dismissable mobile menu. The original garden plan illustration is an inline SVG, with an accessible description and no network dependency.

## Implementation references

- [Next.js installation and App Router setup](https://nextjs.org/docs/app/getting-started/installation)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [FTC consumer privacy guidance](https://www.ftc.gov/business-guidance/privacy-security/consumer-privacy): background for keeping privacy descriptions tied to actual site behavior; this draft is not a compliance certification.
