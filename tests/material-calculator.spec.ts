import { expect, test, type Page } from "@playwright/test";

async function fillRectangle(page: Page) {
  await page.getByLabel("Shape", { exact: true }).selectOption("rectangle");
  await page.getByLabel("Length", { exact: true }).fill("40");
  await page.getByLabel("Length unit", { exact: true }).selectOption("ft");
  await page.getByLabel("Width", { exact: true }).fill("12");
  await page.getByLabel("Width unit", { exact: true }).selectOption("ft");
  await page.getByLabel("Depth", { exact: true }).fill("3");
  await page.getByLabel("Depth unit", { exact: true }).selectOption("in");
}

async function calculate(page: Page) {
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
}

test("main Part 3 example keeps base volume and calculates remaining weight", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  await fillRectangle(page);
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByLabel("Existing quantity", { exact: true }).fill("0.5");
  await calculate(page);

  await expect(page.getByTestId("cubic-feet")).toHaveText("120.00 ft³");
  await expect(page.getByTestId("cubic-yards")).toHaveText("4.44 yd³");
  await expect(page.getByTestId("cubic-meters")).toHaveText("3.398 m³");
  await expect(page.getByTestId("planned-volume")).toHaveText("4.89 yd³");
  await expect(page.getByTestId("existing-volume")).toHaveText("0.50 yd³");
  await expect(page.getByTestId("remaining-volume")).toHaveText("4.39 yd³");
  await expect(page.getByTestId("short-tons")).toHaveText("6.14");
  await expect(page.getByTestId("pounds")).toHaveText("12,288.89 lb");
  await expect(page.getByTestId("metric-tonnes")).toHaveText("5.574 t");

  const result = page.getByRole("region", { name: "Estimated Volume" });
  await expect(result).toContainText(
    "4.444444 × (1 + 10 ÷ 100) = 4.888889 yd³",
  );
  await expect(result).toContainText(
    "max(0, 4.888889 − 0.5) = 4.388889 yd³",
  );
  await expect(result).toContainText(
    "4.388889 × 1.4 = 6.144444 US short tons",
  );
});

test("allowance presets and an existing volume above the requirement are handled", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  await fillRectangle(page);
  await page.getByLabel("Extra Allowance", { exact: true }).selectOption("0");
  await calculate(page);
  await expect(page.getByTestId("planned-volume")).toHaveText("4.44 yd³");
  await expect(page.getByTestId("remaining-volume")).toHaveText("4.44 yd³");

  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByLabel("Existing quantity", { exact: true }).fill("100");
  await calculate(page);
  await expect(page.getByTestId("remaining-volume")).toHaveText("0.00 yd³");
  await expect(page.getByTestId("short-tons")).toHaveText("0.00");
  await expect(page.getByTestId("pounds")).toHaveText("0.00 lb");
  await expect(page.getByTestId("metric-tonnes")).toHaveText("0.000 t");
});

test("custom density and cubic-foot stock update the material estimate", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  await fillRectangle(page);
  await page
    .getByLabel("Gravel / material type", { exact: true })
    .selectOption("custom");
  await expect(
    page.getByLabel("Density (short tons / yd³)", { exact: true }),
  ).toHaveValue("");
  await page
    .getByLabel("Density (short tons / yd³)", { exact: true })
    .fill("1.72");
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByLabel("Existing quantity", { exact: true }).fill("27");
  await page
    .getByLabel("Existing quantity unit", { exact: true })
    .selectOption("ft3");
  await calculate(page);

  const result = page.getByRole("region", { name: "Estimated Volume" });
  await expect(result).toContainText("Custom");
  await expect(result).toContainText("1.72 short tons / yd³");
  await expect(page.getByTestId("existing-volume")).toHaveText(
    "27.00 ft³ (1.00 yd³)",
  );
  await expect(page.getByTestId("remaining-volume")).toHaveText("3.89 yd³");
  await expect(page.getByTestId("short-tons")).toHaveText("6.69");
});

test("material fields show inline validation and prevent calculation", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  await fillRectangle(page);

  const density = page.getByLabel("Density (short tons / yd³)", {
    exact: true,
  });
  for (const invalid of ["", "0", "-1", "Infinity"]) {
    await density.fill(invalid);
    await calculate(page);
    await expect(density).toHaveAttribute("aria-invalid", "true");
    await expect(density).toBeFocused();
    await expect(page.locator("#density-error")).toContainText(
      "Enter a density greater than 0",
    );
    await expect(
      page.getByRole("region", { name: "Estimated Volume" }),
    ).toHaveCount(0);
  }

  await density.fill("1.40");
  await page
    .getByLabel("Extra Allowance", { exact: true })
    .selectOption("custom");
  const allowance = page.getByLabel("Custom extra allowance (%)", {
    exact: true,
  });
  for (const invalid of ["", "-1", "101", "Infinity"]) {
    await allowance.fill(invalid);
    await calculate(page);
    await expect(allowance).toHaveAttribute("aria-invalid", "true");
    await expect(allowance).toBeFocused();
    await expect(page.locator("#allowance-error")).toContainText("0 to 100%");
  }

  await allowance.fill("10");
  await page.getByRole("radio", { name: "Yes" }).check();
  const existing = page.getByLabel("Existing quantity", { exact: true });
  for (const invalid of ["", "-1", "Infinity"]) {
    await existing.fill(invalid);
    await calculate(page);
    await expect(existing).toHaveAttribute("aria-invalid", "true");
    await expect(existing).toBeFocused();
    await expect(page.locator("#existing-quantity-error")).toContainText(
      "0 or more",
    );
  }
});

test("material edits clear stale results and reset restores Part 3 defaults", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  await fillRectangle(page);
  await calculate(page);
  const result = page.getByRole("region", { name: "Estimated Volume" });
  await expect(result).toBeVisible();

  await page
    .getByLabel("Gravel / material type", { exact: true })
    .selectOption("river-rock");
  await expect(result).toHaveCount(0);
  await expect(
    page.getByLabel("Density (short tons / yd³)", { exact: true }),
  ).toHaveValue("1.50");
  await calculate(page);
  await page
    .getByLabel("Density (short tons / yd³)", { exact: true })
    .fill("1.55");
  await expect(result).toHaveCount(0);
  await calculate(page);
  await page.getByLabel("Extra Allowance", { exact: true }).selectOption("5");
  await expect(result).toHaveCount(0);
  await calculate(page);
  await page.getByRole("radio", { name: "Yes" }).check();
  await expect(result).toHaveCount(0);
  await page.getByLabel("Existing quantity", { exact: true }).fill("0.5");
  await calculate(page);
  await page
    .getByLabel("Existing quantity unit", { exact: true })
    .selectOption("m3");
  await expect(result).toHaveCount(0);

  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(
    page.getByLabel("Gravel / material type", { exact: true }),
  ).toHaveValue("general-gravel");
  await expect(
    page.getByLabel("Density (short tons / yd³)", { exact: true }),
  ).toHaveValue("1.40");
  await expect(page.getByLabel("Extra Allowance", { exact: true })).toHaveValue(
    "10",
  );
  await expect(page.getByRole("radio", { name: "No" })).toBeChecked();
  await expect(page.getByLabel("Existing quantity", { exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByLabel("Length", { exact: true })).toHaveValue("");
  await expect(page.locator(".field-error")).toHaveCount(0);
  await expect(result).toHaveCount(0);
});
