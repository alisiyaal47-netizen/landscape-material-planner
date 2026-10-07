import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function calculateMaterial(page: Page) {
  await page.goto("/gravel-calculator");
  await page.getByLabel("Length", { exact: true }).fill("40");
  await page.getByLabel("Width", { exact: true }).fill("12");
  await page.getByLabel("Depth", { exact: true }).fill("3");
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByLabel("Existing quantity", { exact: true }).fill("0.5");
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
}

async function fillBuyingExample(page: Page) {
  await page.getByLabel("Bag weight (lb)", { exact: true }).fill("50");
  await page.getByLabel("Bag price ($)", { exact: true }).fill("5.99");
  await page
    .getByLabel("Price per cubic yard ($)", { exact: true })
    .fill("52");
  await page.getByLabel("Minimum order (yd³)", { exact: true }).fill("1");
  await page
    .getByLabel("Order increment (yd³)", { exact: true })
    .fill("0.5");
  await page.getByLabel("Delivery fee ($)", { exact: true }).fill("75");
}

test("buying planner compares the supplied bag and bulk values", async ({
  page,
}) => {
  await calculateMaterial(page);
  await expect(
    page.getByRole("region", { name: "Compare Buying Options" }),
  ).toBeVisible();
  await fillBuyingExample(page);
  await page.getByRole("button", { name: "Compare options" }).click();

  const comparison = page.getByRole("region", {
    name: "Purchase Comparison",
  });
  await expect(comparison).toBeVisible();
  await expect(page.getByTestId("bags-needed")).toHaveText("246");
  await expect(page.getByTestId("bag-total")).toHaveText("$1,473.54");
  await expect(page.getByTestId("bulk-order")).toHaveText("4.50 yd³");
  await expect(page.getByTestId("bulk-material-cost")).toHaveText("$234.00");
  await expect(page.getByTestId("bulk-delivery")).toHaveText("$75.00");
  await expect(page.getByTestId("bulk-total")).toHaveText("$309.00");
  await expect(page.getByTestId("cost-difference")).toHaveText("$1,164.54");
  await expect(comparison).toContainText("Bulk is lower by $1,164.54");
  await expect(comparison).toContainText(
    "Lower-cost option based on the values you entered.",
  );
  await expect(
    comparison.locator(".comparison-card.is-lower"),
  ).toContainText("Lower entered cost");
  await expect(page.getByTestId("bag-leftover")).not.toContainText("-");
  await expect(page.getByTestId("bulk-leftover")).not.toContainText("-");
  await expect(page.getByTestId("bag-volume-method")).toContainText(
    "0.017857 yd³ per bag",
  );
});

test("direct bag volume works without weight, takes priority and supports equal costs", async ({
  page,
}) => {
  await calculateMaterial(page);
  await page.getByLabel("Bag price ($)", { exact: true }).fill("61.80");
  await page
    .getByLabel("Bag label volume (ft³), optional", { exact: true })
    .fill("27");
  await page
    .getByLabel("Price per cubic yard ($)", { exact: true })
    .fill("52");
  await page.getByLabel("Minimum order (yd³)", { exact: true }).fill("1");
  await page
    .getByLabel("Order increment (yd³)", { exact: true })
    .fill("0.5");
  await page.getByLabel("Delivery fee ($)", { exact: true }).fill("75");
  await page.getByRole("button", { name: "Compare options" }).click();

  const comparison = page.getByRole("region", {
    name: "Purchase Comparison",
  });
  await expect(page.getByTestId("bags-needed")).toHaveText("5");
  await expect(page.getByTestId("bag-total")).toHaveText("$309.00");
  await expect(page.getByTestId("bag-volume-method")).toContainText(
    "27 ft³ label volume",
  );
  await expect(comparison).toContainText(
    "Costs are equal to the nearest cent based on entered values.",
  );
  await expect(page.getByTestId("cost-difference")).toHaveText("$0.00");
  await expect(comparison.getByText("Lower entered cost")).toHaveCount(0);
});

test("buying fields use inline validation and do not replace Part 3 results", async ({
  page,
}) => {
  await calculateMaterial(page);
  await page.getByRole("button", { name: "Compare options" }).click();
  const bagWeight = page.getByLabel("Bag weight (lb)", { exact: true });
  await expect(bagWeight).toBeFocused();
  await expect(bagWeight).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#bagWeight-error")).toContainText(
    "bag weight or a bag label volume",
  );
  await expect(
    page.getByRole("region", { name: "Purchase Comparison" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toBeVisible();

  await fillBuyingExample(page);
  await page
    .getByLabel("Bag label volume (ft³), optional", { exact: true })
    .fill("-1");
  await page
    .getByLabel("Order increment (yd³)", { exact: true })
    .fill("0");
  await page.getByRole("button", { name: "Compare options" }).click();
  await expect(page.locator("#bagVolume-error")).toContainText(
    "greater than 0",
  );
  await expect(page.locator("#orderIncrement-error")).toContainText(
    "greater than 0",
  );
});

test("buying edits clear stale comparison and resets clear Part 4 fields", async ({
  page,
}) => {
  await calculateMaterial(page);
  await fillBuyingExample(page);
  await page.getByRole("button", { name: "Compare options" }).click();
  const comparison = page.getByRole("region", {
    name: "Purchase Comparison",
  });
  await expect(comparison).toBeVisible();

  await page.getByLabel("Bag price ($)", { exact: true }).fill("6.25");
  await expect(comparison).toHaveCount(0);
  await page.getByRole("button", { name: "Reset buying options" }).click();
  for (const label of [
    "Bag weight (lb)",
    "Bag price ($)",
    "Bag label volume (ft³), optional",
    "Price per cubic yard ($)",
    "Minimum order (yd³)",
    "Order increment (yd³)",
    "Delivery fee ($)",
  ]) {
    await expect(page.getByLabel(label, { exact: true })).toHaveValue("");
  }
  await expect(page.locator(".purchase-planner .field-error")).toHaveCount(0);

  await fillBuyingExample(page);
  await page.getByRole("button", { name: "Compare options" }).click();
  await expect(comparison).toBeVisible();
  await page
    .getByLabel("Density (short tons / yd³)", { exact: true })
    .fill("1.50");
  await expect(comparison).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Compare Buying Options" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
  await expect(
    page.getByRole("region", { name: "Compare Buying Options" }),
  ).toBeVisible();
  await expect(page.getByLabel("Bag price ($)", { exact: true })).toHaveValue(
    "",
  );

  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Compare Buying Options" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toHaveCount(0);
});

for (const width of [375, 430, 768, 1024, 1440, 1920]) {
  test(
    "populated purchase comparison is accessible and fits at " + width + "px",
    async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await calculateMaterial(page);
      await fillBuyingExample(page);
      await page.getByRole("button", { name: "Compare options" }).click();
      await expect(
        page.getByRole("region", { name: "Purchase Comparison" }),
      ).toBeVisible();
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
