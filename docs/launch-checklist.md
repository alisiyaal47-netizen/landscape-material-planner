# Fieldplan launch and Search Console handoff

## Current launch blockers

No production origin, deployment-platform configuration or working public contact is recorded. The GitHub homepage field is empty. No deployment has been performed or verified in Part 6. Hosting data practices and operator details are still missing from draft legal pages. Local verification is not public launch completion.

## Owner inputs required

1. Supply the actual owned HTTPS domain and intended Next.js deployment platform/project access.
2. Supply the public operator identity and working contact address/URL. The existing form deliberately sends nothing.
3. Confirm hosting logs, purposes and retention, and review privacy/terms for the operator's circumstances. No compliance certification is claimed.
4. Once contact/privacy/terms are complete, remove only finalized paths from `draftRoutes` in `lib/site.ts`, update expected sitemap tests and rebuild.

## Exact deployment sequence

1. Connect this GitHub repository to the intended Next.js host, using root directory and branch `main`. Use supported Node.js >=20.9.
2. Set production build variables: `SITE_MODE=production`; `SITE_URL` = the actual HTTPS origin, with no path/query/credentials/custom port. Do not use the test fixture or blank example value. Set preview environments to `SITE_MODE=preview`.
3. Run `npm ci`, then `npm run verify` with that real origin. Run `npm run build` with the same production variables to generate the deployable artifact.
4. Deploy using native Next.js support. For a Node host, run `npm run start` behind its HTTPS proxy. Never deploy `.next` from a default test-fixture verification run.
5. Configure DNS/TLS and permanent redirects from HTTP and secondary hostnames to the canonical hostname. Only one origin should serve indexable copies.
6. On the live origin, confirm the five indexable pages return 200 and a made-up path returns 404. Check there is no host-added `X-Robots-Tag: noindex`, authentication barrier or redirect loop. Verify canonical and social URLs in page source.
7. Load `/robots.txt` and `/sitemap.xml`. Confirm only expected indexable URLs at the real origin: no localhost, `.test`, preview, draft or missing URLs. Core production pages must show index/follow.
8. Run the main calculator example and confirm copy/print over HTTPS. Check 375, 768, 1024 and 1440px, including a populated final plan.
9. Run PageSpeed Insights on the deployed site and review field LCP, CLS and INP when enough real-user data exists. Local measurements cannot certify Core Web Vitals. No monitoring script was added.

## Google Search Console

1. Verify the correct production Domain property via DNS, or the exact HTTPS URL-prefix property if appropriate. This requires owner access.
2. Submit the live `/sitemap.xml` and inspect its processing status.
3. Inspect the homepage and `/gravel-calculator`. Compare Google's selected canonical with the declared canonical.
4. Test Live URL to confirm Google can fetch/render each page and see the indexing directives.
5. Request indexing for important new URLs where appropriate after live checks pass. Do not request unfinished noindex drafts.
6. Monitor Page indexing and Search performance: actual queries, impressions, clicks, CTR and average position. Use meaningful date ranges and page/query groups. No traffic or ranking promise.
7. Diagnose status codes, robots/noindex, canonical choice, rendered content and quality before repeating requests. Indexing requests are not a repair strategy.

Reference: [Google Search Console guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start).

## Verification record

Final local verification: October 4, 2026.

- Corrected targeted SEO rerun: 19 passed. The noscript fallback is checked in the response HTML because Playwright text selectors omit noscript content.
- Final production release runner: lint passed with zero warnings; route type generation and TypeScript passed; optimized production build passed; all 168 tests passed (147 existing regressions and 21 SEO tests).
- Separate preview build without SITE_URL passed; all 30 SEO/foundation tests passed. Pages expose noindex/follow, no invented canonical/schema origin, an empty sitemap and no sitemap declaration in robots.txt.
- Production rendering used only the reserved local test fixture. Verified unique titles/descriptions, one H1, heading order, canonical/query behavior, social metadata, five sitemap URLs, deliberate draft exclusions, crawlable internal links, JSON-LD and real noindex 404s.
- Added two origin regression cases after finding that a trailing DNS dot could bypass localhost/placeholder validation. No Parts 1–5 calculation, state or export code changed.
- Visual review of calculator introduction and explanatory content at 375, 768, 1024 and 1440px passed. Homepage reviewed at 375 and 1440px. Automated tests additionally cover all eight routes, navigation, calculator results, purchase comparison and final-plan accessibility/overflow at all four widths.
- Generated JavaScript remains 10 chunks totaling 639,002 bytes, unchanged from the baseline. No dependency or third-party script was added. No field Core Web Vitals result is claimed.
- No known failing local check. No deployment, public indexing or Search Console verification performed; the owner inputs above remain launch blockers.

## Strict SEO Launch Score: 81/100

This is an internal readiness assessment, not a Google metric or ranking prediction.

| Area | Score | Remaining limitation |
| --- | --- | --- |
| Technical SEO | 19/20 | Local checks pass; public-host headers and redirects remain unverified. |
| Search intent | 18/20 | Current query research informs one focused tool; no Search Console query evidence yet. |
| Content | 18/20 | Useful instructions, worked example and complete formulas; real-user feedback remains unavailable. |
| Trust | 9/15 | Honest limitations; operator, working contact and final legal/hosting details are missing. |
| Performance/mobile | 13/15 | Responsive/accessibility checks pass and JS is unchanged; no deployed field performance evidence. |
| Indexing readiness | 4/10 | Configuration and handoff are ready; real origin, deployment, sitemap submission and live inspection remain. |
