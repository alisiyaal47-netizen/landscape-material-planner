# Part 6 SEO audit and intent map

Audit/research date: October 3, 2026. Baseline: `333ae74af23333b93cb92c2e460c376d6173eddd` (Parts 1–5).

## Before-edit audit

| Area | Finding | Decision |
| --- | --- | --- |
| Architecture | Eight static public pages, App Router, pure math outside React; no API/database/analytics. | Preserve architecture and all calculator logic. |
| Metadata | Unique titles/descriptions already exist; canonicals, robots and sitemap silently fall back to localhost. | Retain helper; validate explicit production origin and add social metadata/indexing policy. |
| Search focus | Generic gravel title; homepage description implies mulch and soil calculators exist. | Task-focused gravel title; honest single-tool homepage positioning. |
| Content | Useful density/allowance explanations. Homepage, About, Terms and footer still describe volume-only or future purchase features. | Correct stale capability statements; preserve useful explanations. |
| Methodology | Geometry, conversions, density, allowance and weight documented; purchase formulas/final-plan behavior missing. | Complete methodology using existing code as source of truth. |
| Trust | Contact preview cannot receive messages; privacy/terms incomplete. No operator or production host supplied. | Keep limitations visible; intentional noindex/follow for these three drafts. Owner action remains. |
| Links | Navigation/footer reaches all routes; future cards have no routes; methodology needs a return path. | Preserve crawl paths and add contextual calculator/example/limitations links. |
| Rendering | Explanations server-rendered; interactive calculator client-side; not-found component exists. | Test with JavaScript disabled and verify real 404/noindex. |
| Schema | None. | WebSite on home; WebApplication and visible BreadcrumbList on gravel. |
| Images | Inline garden SVG has accessible title/description; decorative icons hidden from accessibility tree. | Preserve semantics, add intrinsic dimensions; no stock imagery. |
| Performance | System fonts, no third-party scripts or large raster images. | Add server content only; no dependencies or calculator rebuild. |

## Current search research

Direct Google searches used `gl=us`, `hl=en`, `pws=0`. Google displayed “Results are not personalized” and an unknown exact location. This is a current US-targeted sample, not a controlled city-level rank report. Order and modules vary. No search volume, KD, CPC, traffic or ranking metrics were available or invented.

| Query family sampled | Observed intent/results | Page treatment |
| --- | --- | --- |
| gravel calculator; gravel calculator cubic yards; gravel calculator tons | Calculator.net, Omni, Inch Calculator and suppliers; dimensions, depth, volume and weight dominate. | Core estimate, mixed units and yards/tons distinction. |
| how much gravel do I need; driveway gravel calculator | Formula instructions, coverage/depth questions and general/driveway tools. | Measurement tips and worked example; no invented construction depth. |
| gravel calculator with cost | Quantity plus entered unit price; tools and supplier results. | Explain exactly which entered costs are compared. |
| gravel bags calculator | Bag size/rounding questions, including 50 lb bag coverage. | Label-volume priority and density-dependent weight conversion. |
| gravel bags vs bulk | Supplier guides and forums; handling, delivery and minimum-order questions. | Compare entered values and leftovers; no blanket winner. |
| gravel delivery cost calculator | Material-plus-delivery tools and local supplier pricing workflows. | Users enter the fee; no ZIP-based estimator/live quote claim. |

### Competing pages reviewed directly

- [Calculator.net](https://www.calculator.net/gravel-calculator.html): calculator first, shape/density/bag-price inputs, extensive material background. Its text excludes delivery/labor from cost. Fieldplan can emphasize its entered delivery fee and final plan instead of adding gravel history.
- [Inch Calculator](https://www.inchcalculator.com/gravel-calculator/): yards/tons title, dimension/area/volume entry, optional price, formulas and density tables. Fieldplan emphasizes stock deduction and bag/bulk order workflow. No author/reviewer claims or construction recommendations were borrowed.
- [Omni Calculator](https://www.omnicalculator.com/construction/gravel): volume, weight and price followed by how-to/material explanations. Its mass/volume pricing makes cost intent clear. Fieldplan must state that bulk pricing is per cubic yard and must match a supplier quote.
- [Gravelshop](https://www.gravelshop.com/shop/calculate-cubic-yard-feet-ton.asp): product selection, quantity and location-based delivered pricing intent. Fieldplan is an entered-input planner, not a supplier catalog or availability service.
- [Hello Gravel buying guide](https://hellogravel.com/guides/bagged-vs-bulk-gravel-cost-break-even-hidden-fees-2026/): commercial guide centered on delivery, handling, minimums and the purchase decision. This supports addressing those questions; its general price/break-even claims are not used as Fieldplan facts or defaults.

These observations identify an opportunity within the sample, not proof of unique features across the web.

## Chosen intent and existing-page map

**Primary intent:** estimate gravel required for a measured space and turn it into a buying plan using entered bag/bulk prices.

Supporting intents: cubic yards and estimated US short tons; mixed units; allowance and existing stock; bag count versus bulk order rules; delivery, leftovers and a portable summary. These stay on `/gravel-calculator`.

| Route | Purpose / natural topic | Policy in production |
| --- | --- | --- |
| / | Fieldplan brand and landscape planning; gravel available now | Index |
| /gravel-calculator | Primary quantity-to-buying-plan intent | Index |
| /methodology | Formulas, units, assumptions and transparency | Index |
| /about | What Fieldplan does and its limits | Index |
| /contact | Questions/corrections; non-sending preview | Noindex/follow until operational |
| /privacy-policy | Data practices and pending hosting/operator review | Noindex/follow until reviewed |
| /terms | Informational use and purchase responsibility; draft | Noindex/follow until reviewed |
| /disclaimer | Planning and entered-cost limitations | Index |

No commercial keywords forced onto legal/about pages. No new public page or calculator.

## Technical decisions

- Production requires an explicit HTTPS origin; no localhost fallback. Canonical, Open Graph, schema, sitemap and robots share that origin. Query variants canonicalize to clean paths.
- Sitemap contains the five currently indexable pages. Drafts remain linked and crawlable with explicit noindex/follow. Finalize their content before removing them from `draftRoutes` and updating the sitemap expectations.
- Preview/development modes use noindex and empty sitemap. Robots allows crawling so indexing directives remain visible; it is not used to prevent indexing.
- Metadata is static, unique and server-visible. Real 404 responses have no canonical and explicit noindex.
- JSON-LD describes visible content only. No ratings, reviews, expert, FAQ or invented organization details. WebApplication supplies semantics; software rich-result eligibility is not claimed.
- New explanatory content is server-rendered. Existing calculator math, state, copy and print logic are untouched.

## Validation boundaries

The release runner uses an explicit HTTPS test origin for local production rendering. Reserved `fieldplan.test` is a test fixture, not a production-domain choice. Final checks/blockers are recorded in [launch-checklist.md](launch-checklist.md).

Indexing, Google-selected canonicals, rich-result display and rankings cannot be established locally. Deployed verification and Search Console remain necessary. Local performance measurements are not real-user Core Web Vitals.

## Primary implementation references

- [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Google robots guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro).
- [Google software application markup](https://developers.google.com/search/docs/appearance/structured-data/software-app) and [Schema.org WebApplication](https://schema.org/WebApplication).
- [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) and [JSON-LD](https://nextjs.org/docs/app/guides/json-ld).
- [Search Console guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start).
