import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/gravel-calculator",
  "/about",
  "/contact",
  "/methodology",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
];
const canonicalOrigin = process.env.SITE_URL
  ? new URL(process.env.SITE_URL).origin
  : undefined;
const isProduction = process.env.SITE_MODE === "production";

test("all routes have unique SEO metadata, one H1 and no runtime errors", async ({
  page,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("main")).toBeVisible();
    const title = await page.title();
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(title.length).toBeGreaterThan(10);
    expect(description?.length).toBeGreaterThan(40);
    expect(titles.has(title)).toBe(false);
    expect(descriptions.has(description!)).toBe(false);
    titles.add(title);
    descriptions.add(description!);
    if (canonicalOrigin) {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href", `${canonicalOrigin}${route === "/" ? "" : route}`,
      );
    } else {
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    }
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations, JSON.stringify(audit.violations, null, 2)).toEqual(
      [],
    );
  }
  expect(errors).toEqual([]);
});

for (const width of [375, 768, 1024, 1440]) {
  test(`all routes fit at ${width}px; navigation works`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /^(Menu|Close)/ });
    if (width <= 800) {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toBeFocused();
      await toggle.click();
    }
    await page
      .getByRole("navigation", { name: "Primary", exact: true })
      .getByRole("link", { name: "Guides", exact: true })
      .click();
    await expect(page).toHaveURL(/\/#guides$/);
    await expect(page.locator("#guides")).toBeInViewport();
    if (width <= 800) {
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await toggle.click();
    }
    await page
      .getByRole("navigation", { name: "Primary", exact: true })
      .getByRole("link", { name: "Tools", exact: true })
      .click();
    await expect(page.locator("#tools")).toBeInViewport();
    if (width <= 800) await toggle.click();
    await page
      .getByRole("navigation", { name: "Primary", exact: true })
      .getByRole("link", { name: "Methodology", exact: true })
      .click();
    await expect(page).toHaveURL(/\/methodology$/);
    if (width <= 800)
      await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
  });
}

test("contact preview cannot submit or leak fields into the URL", async ({
  page,
}) => {
  await page.goto("/contact");
  const submissions: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") submissions.push(request.url());
  });
  await page.getByLabel("Name", { exact: true }).fill("Preview User");
  await page.getByLabel("Email", { exact: true }).fill("preview@example.com");
  await page.getByLabel("Subject", { exact: true }).fill("Test subject");
  await page.getByLabel("Message", { exact: true }).fill("Preview only.");
  await page.getByLabel("Subject", { exact: true }).press("Enter");
  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole("button", { name: "Send Message — Coming Soon" }),
  ).toBeDisabled();
  await expect(
    page.getByText("This form is a preview.", { exact: false }),
  ).toBeVisible();
  expect(submissions).toEqual([]);
});

test("links point to existing pages and section targets; future tools have no routes", async ({
  page,
  request,
}) => {
  const destinations = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href^="/"], a[href^="#"]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")!),
      )) {
      destinations.add(new URL(href, `http://localhost:3000${route}`).href);
    }
  }
  for (const destination of destinations) {
    const url = new URL(destination);
    expect((await request.get(url.pathname)).status()).toBe(200);
    if (url.hash) {
      await page.goto(destination);
      await expect(page.locator(url.hash)).toHaveCount(1);
    }
  }
  await page.goto("/");
  await expect(page.getByRole("contentinfo").getByRole("link")).toHaveCount(8);
  await expect(
    page.locator(".tool-card:not(.tool-card-featured) a"),
  ).toHaveCount(0);
  expect((await request.get("/mulch-calculator")).status()).toBe(404);
});

test("keyboard users can skip navigation and see focus", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  expect(await skip.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
    "solid",
  );
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("sitemap lists exactly indexable routes and robots exposes it in production", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  const expected = isProduction
    ? routes.filter((route) => !["/contact", "/terms", "/privacy-policy"].includes(route))
    : [];
  expect(locations.sort()).toEqual(expected.sort());
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  if (isProduction) {
    expect(await robots.text()).toContain(`Sitemap: ${canonicalOrigin}/sitemap.xml`);
  } else {
    expect(await robots.text()).not.toContain("Sitemap:");
  }
});
