import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function calculateMaterial(page: Page, existing = "0.5") {
  await page.goto("/gravel-calculator");
  await page.getByLabel("Length", { exact: true }).fill("40");
  await page.getByLabel("Width", { exact: true }).fill("12");
  await page.getByLabel("Depth", { exact: true }).fill("3");
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByLabel("Existing quantity", { exact: true }).fill(existing);
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
}

async function fillBuyingValues(
  page: Page,
  {
    bagWeight = "50",
    bagPrice = "5.99",
    bagVolume = "",
    bulkPrice = "52",
    minimum = "1",
    increment = "0.5",
    delivery = "75",
  } = {},
) {
  if (bagWeight) {
    await page.getByLabel("Bag weight (lb)", { exact: true }).fill(bagWeight);
  }
  await page.getByLabel("Bag price ($)", { exact: true }).fill(bagPrice);
  if (bagVolume) {
    await page
      .getByLabel("Bag label volume (ft³), optional", { exact: true })
      .fill(bagVolume);
  }
  await page
    .getByLabel("Price per cubic yard ($)", { exact: true })
    .fill(bulkPrice);
  await page.getByLabel("Minimum order (yd³)", { exact: true }).fill(minimum);
  await page
    .getByLabel("Order increment (yd³)", { exact: true })
    .fill(increment);
  await page.getByLabel("Delivery fee ($)", { exact: true }).fill(delivery);
}

async function createMainPlan(page: Page) {
  await calculateMaterial(page);
  await fillBuyingValues(page);
  await page.getByRole("button", { name: "Compare options" }).click();
  return page.getByRole("region", { name: "Your Gravel Project Plan" });
}

test("main flow creates a complete project plan with the bulk recommendation", async ({
  page,
}) => {
  const plan = await createMainPlan(page);
  await expect(plan).toBeVisible();
  await expect(plan).toContainText("Driveway");
  await expect(plan).toContainText("Rectangle");
  await expect(plan).toContainText("40 ft × 12 ft × 3 in");
  await expect(plan).toContainText("General Gravel");
  await expect(plan).toContainText("1.40 short tons / yd³");
  await expect(page.getByTestId("plan-remaining")).toHaveText("4.39 yd³");
  await expect(page.getByTestId("plan-bag-quantity")).toHaveText(
    "246 × 50 lb bags",
  );
  await expect(page.getByTestId("plan-bulk-quantity")).toHaveText(
    "4.5 cubic yards bulk",
  );
  await expect(page.getByTestId("plan-lower-option")).toHaveText("Bulk");
  await expect(page.getByTestId("plan-recommendation")).toHaveText(
    "Based on your entered values, bulk has the lower estimated cost.",
  );
  await expect(page.getByTestId("plan-purchase-quantity")).toHaveText(
    "4.5 cubic yards bulk",
  );
  await expect(page.getByTestId("plan-estimated-total")).toHaveText("$309.00");
  await expect(page.getByTestId("plan-estimated-leftover")).toHaveText(
    "0.11 yd³",
  );
  await expect(plan).toContainText(
    "Lower-cost option based on the values you entered.",
  );
  await expect(plan).toContainText("Planning estimates only.");
});

test("bags can be the recommended entered option", async ({ page }) => {
  await calculateMaterial(page);
  await fillBuyingValues(page, { bagPrice: "0.10" });
  await page.getByRole("button", { name: "Compare options" }).click();
  const plan = page.getByRole("region", { name: "Your Gravel Project Plan" });
  await expect(page.getByTestId("plan-lower-option")).toHaveText("Bags");
  await expect(page.getByTestId("plan-recommendation")).toHaveText(
    "Based on your entered values, bags have the lower estimated cost.",
  );
  await expect(page.getByTestId("plan-purchase-quantity")).toHaveText(
    "246 × 50 lb bags",
  );
  await expect(page.getByTestId("plan-estimated-total")).toHaveText("$24.60");
  await expect(plan).not.toContainText("best deal");
  await expect(plan).not.toContainText("guaranteed cheapest");
});

test("equal entered costs produce no false winner", async ({ page }) => {
  await calculateMaterial(page);
  await fillBuyingValues(page, {
    bagWeight: "",
    bagPrice: "61.80",
    bagVolume: "27",
  });
  await page.getByRole("button", { name: "Compare options" }).click();
  const plan = page.getByRole("region", { name: "Your Gravel Project Plan" });
  await expect(page.getByTestId("plan-lower-option")).toHaveText(
    "Costs are equal",
  );
  await expect(page.getByTestId("plan-recommendation")).toHaveText(
    "Both options have the same estimated entered cost.",
  );
  await expect(plan.getByText("Estimated totals", { exact: true })).toBeVisible();
  await expect(plan).not.toContainText("have the lower estimated cost");
  await expect(plan).not.toContainText(
    "Lower-cost option based on the values you entered.",
  );
});

test("existing material coverage skips meaningless buying recommendations", async ({
  page,
}) => {
  await calculateMaterial(page, "100");
  const plan = page.getByRole("region", { name: "Your Gravel Project Plan" });
  await expect(plan).toBeVisible();
  await expect(plan).toContainText("Purchase needed: 0");
  await expect(plan).toContainText(
    "Your entered existing material covers the estimated requirement.",
  );
  await expect(
    page.getByRole("button", { name: "Compare options" }),
  ).toHaveCount(0);
  await expect(plan.getByText("Recommended entered option")).toHaveCount(0);
  await expect(plan.getByText("Buying options", { exact: false })).toHaveCount(
    0,
  );
});

test("Copy Plan writes a clean text snapshot and announces success", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://localhost:3000",
  });
  await createMainPlan(page);
  await page.getByRole("button", { name: "Copy Plan" }).click();
  await expect(page.getByText("Project plan copied.", { exact: true })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("Gravel Project Plan");
  expect(copied).toContain("Project: Driveway");
  expect(copied).toContain("Material: General Gravel");
  expect(copied).toContain("Remaining: 4.39 yd³");
  expect(copied).toContain("246 × 50 lb bags");
  expect(copied).toContain("4.5 yd³ bulk");
  expect(copied).toContain("Lower entered cost: Bulk");
  expect(copied).toContain("Difference: $1,164.54");
  expect(copied).toContain("Planning estimates only.");
});

test("relevant calculator and purchase edits invalidate the old plan", async ({
  page,
}) => {
  const plan = await createMainPlan(page);
  await expect(plan).toBeVisible();
  await page.getByLabel("Bag price ($)", { exact: true }).fill("6.25");
  await expect(plan).toHaveCount(0);

  await page.getByRole("button", { name: "Compare options" }).click();
  await expect(plan).toBeVisible();
  await page
    .getByLabel("Project type", { exact: true })
    .selectOption("Path");
  await expect(plan).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toHaveCount(0);
});

test("Print Plan invokes browser print and print media hides interactive chrome", async ({
  page,
}) => {
  await createMainPlan(page);
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printCalled = "true";
    };
  });
  await page.getByRole("button", { name: "Print Plan" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-print-called", "true");

  await page.emulateMedia({ media: "print" });
  expect(
    await page.locator(".site-header").evaluate((element) =>
      getComputedStyle(element).display,
    ),
  ).toBe("none");
  expect(
    await page.locator(".site-footer").evaluate((element) =>
      getComputedStyle(element).display,
    ),
  ).toBe("none");
  expect(
    await page.locator(".skip-link").evaluate((element) =>
      getComputedStyle(element).display,
    ),
  ).toBe("none");
  expect(
    await page.locator(".project-plan-actions").evaluate((element) =>
      getComputedStyle(element).display,
    ),
  ).toBe("none");
  expect(
    await page.locator(".purchase-comparison").evaluate((element) =>
      getComputedStyle(element).display,
    ),
  ).toBe("none");
  await expect(
    page.getByRole("region", { name: "Your Gravel Project Plan" }),
  ).toBeVisible();
});

for (const width of [375, 430, 768, 1024, 1440, 1920]) {
  test(
    "final project plan is accessible and fits at " + width + "px",
    async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      const plan = await createMainPlan(page);
      await expect(plan).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
    },
  );
}
