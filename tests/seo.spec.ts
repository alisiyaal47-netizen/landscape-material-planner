import { expect, test } from "@playwright/test";
import { resolveSiteConfig } from "../lib/site-config";

const paths = ["/", "/gravel-calculator", "/methodology", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"];
const drafts = ["/contact", "/privacy-policy", "/terms"];
const production = process.env.SITE_MODE === "production";
const origin = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : undefined;

test("production origin is explicit and normalized; preview has no invented origin", () => {
  expect(resolveSiteConfig({ NODE_ENV: "production", SITE_URL: "https://fieldplan.test/" }))
    .toMatchObject({ url: "https://fieldplan.test", indexable: true });
  expect(resolveSiteConfig({ NODE_ENV: "production", SITE_MODE: "preview" }))
    .toMatchObject({ url: undefined, indexable: false });
  expect(() => resolveSiteConfig({ SITE_MODE: "typo" })).toThrow();
});

test("development mode stays non-indexable without inventing an origin", () => {
  expect(resolveSiteConfig({ NODE_ENV: "development" })).toMatchObject({
    url: undefined,
    indexable: false,
    mode: "development",
  });
});

for (const invalid of [undefined, "", "not a url", "http://fieldplan.test", "https://localhost", "https://localhost.", "https://127.0.0.1", "https://[::1]", "https://example.com", "https://example.com.", "https://preview.example.com", "https://fieldplan.test/path", "https://fieldplan.test?q=1", "https://fieldplan.test#page", "https://user:pass@fieldplan.test", "https://fieldplan.test:8443"]) {
  test(`production rejects invalid SITE_URL ${JSON.stringify(invalid)}`, () => {
    expect(() => resolveSiteConfig({ NODE_ENV: "production", SITE_URL: invalid })).toThrow();
  });
}

test("server HTML exposes unique metadata, canonical and indexing intent without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const titles = new Set<string>();
  for (const path of paths) {
    const response = await page.goto(`http://localhost:3000${path}`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title)).toBe(false);
    titles.add(title);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description!.length).toBeGreaterThan(40);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description!);
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toBe(`${production && !drafts.includes(path) ? "index" : "noindex"}, follow`);
    if (origin) {
      const canonical = `${origin}${path === "/" ? "" : path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
      if (production) expect(canonical).not.toMatch(/localhost|127\.0\.0\.1/);
    }
    const headingLevels = await page.locator("h1,h2,h3,h4,h5,h6").evaluateAll(
      (headings) => headings.map((heading) => Number(heading.tagName.slice(1))),
    );
    for (let index = 1; index < headingLevels.length; index++) {
      expect(headingLevels[index]).toBeLessThanOrEqual(headingLevels[index - 1] + 1);
    }
  }
  const gravelResponse = await page.goto("http://localhost:3000/gravel-calculator");
  await expect(page.getByRole("heading", { name: "How to use the gravel calculator" })).toBeVisible();
  await expect(page.locator("#worked-example")).toContainText("$1,164.54");
  // Playwright text selectors skip noscript nodes; verify the fallback in HTML.
  expect(await gravelResponse!.text()).toContain('<noscript><p class="notice calculator-guides-note">Enable JavaScript to calculate');
  await context.close();
});

test("sitemap entries match canonical indexable pages, with no drafts or missing URLs", async ({ request, page }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  expect([...urls].sort()).toEqual(production ? paths.filter((path) => !drafts.includes(path)).map((path) => `${origin}${path === "/" ? "" : path}`).sort() : []);
  for (const url of urls) {
    expect(new URL(url).origin).toBe(origin);
    await page.goto(new URL(url).pathname);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  }
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Allow: /");
  expect(await robots.text()).not.toContain("Disallow: /");
});

test("JSON-LD matches visible site, application and breadcrumb content without invented claims", async ({ page }) => {
  for (const path of ["/", "/gravel-calculator"]) {
    await page.goto(path);
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(scripts.length).toBe(origin ? 1 : 0);
    if (!origin) continue;
    const data = JSON.parse(scripts[0]);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"].map((node: Record<string, unknown>) => node["@type"]))
      .toEqual(path === "/" ? ["WebSite"] : ["BreadcrumbList", "WebApplication"]);
    expect(scripts[0]).not.toMatch(/AggregateRating|Review|FAQPage|Person|ratingValue/);
    if (path !== "/") {
      const [breadcrumb, application] = data["@graph"];
      expect(breadcrumb.itemListElement.map((item: Record<string, unknown>) => item.position)).toEqual([1, 2]);
      expect(breadcrumb.itemListElement[1].item).toBe(`${origin}${path}`);
      expect(application.url).toBe(`${origin}${path}`);
      expect(application.isAccessibleForFree).toBe(true);
      await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Gravel Calculator");
    }
  }
});

test("query variants canonicalize to the clean page and missing routes are real noindex 404s", async ({ page }) => {
  await page.goto("/gravel-calculator?utm_source=seo-test");
  if (origin) await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}/gravel-calculator`);
  const response = await page.goto("/missing-seo-test");
  expect(response?.status()).toBe(404);
  const robots = await page.locator('meta[name="robots"]').evaluateAll((tags) => tags.map(tag => tag.getAttribute("content")));
  expect(robots.some(value => value?.includes("noindex"))).toBe(true);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
