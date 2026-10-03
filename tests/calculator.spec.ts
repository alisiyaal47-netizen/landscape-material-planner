import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function rectangle(
  page: Page,
  values = ["40", "12", "3"],
  units = ["ft", "ft", "in"],
) {
  await page.getByLabel("Shape", { exact: true }).selectOption("rectangle");
  for (const [index, field] of ["Length", "Width", "Depth"].entries()) {
    await page.getByLabel(field, { exact: true }).fill(values[index]);
    await page
      .getByLabel(`${field} unit`, { exact: true })
      .selectOption(units[index]);
  }
}

test("supplied rectangle cases display expected results and mixed-unit breakdowns", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  for (const example of [
    {
      values: ["40", "12", "3"],
      units: ["ft", "ft", "in"],
      expected: ["120.00 ft³", "4.44 yd³", "3.398 m³"],
    },
    {
      values: ["10", "5", "10"],
      units: ["m", "m", "cm"],
      expected: ["176.57 ft³", "6.54 yd³", "5.000 m³"],
    },
    {
      values: ["12", "10", "6"],
      units: ["ft", "ft", "in"],
      expected: ["60.00 ft³", "2.22 yd³", "1.699 m³"],
    },
    {
      values: ["12.5", "7.25", "2.5"],
      units: ["ft", "ft", "in"],
      expected: ["18.88 ft³", "0.70 yd³", "0.535 m³"],
    },
  ]) {
    await rectangle(page, example.values, example.units);
    await page.getByRole("button", { name: "Calculate Gravel" }).click();
    for (const [index, id] of [
      "cubic-feet",
      "cubic-yards",
      "cubic-meters",
    ].entries())
      await expect(page.getByTestId(id)).toHaveText(example.expected[index]);
  }
  await rectangle(page);
  await page.getByLabel("Depth", { exact: true }).press("Enter");
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toContainText("3 in = 0.25 ft");
  await expect(page.getByRole("status")).toContainText("4.44 cubic yards");
});

test("shape, units and edits invalidate results; reset clears errors and values", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  await rectangle(page);
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
  await page.getByLabel("Length unit", { exact: true }).selectOption("m");
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
  await page.getByLabel("Length", { exact: true }).fill("41");
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
  await page.getByLabel("Shape", { exact: true }).selectOption("circle");
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Length", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Width", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Depth", { exact: true })).toHaveValue("3");
  await page.getByLabel("Diameter", { exact: true }).fill("10");
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
  await expect(page.getByTestId("cubic-feet")).toHaveText("19.63 ft³");
  await expect(page.getByTestId("cubic-yards")).toHaveText("0.73 yd³");
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toContainText("Radius = diameter ÷ 2");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByLabel("Diameter", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Depth", { exact: true })).toHaveValue("");
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(2);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  await expect(page.locator(".field-error")).toHaveCount(0);
  await page.getByLabel("Shape", { exact: true }).selectOption("rectangle");
  await expect(page.getByLabel("Length", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Width", { exact: true })).toHaveValue("");
});

test("inline validation rejects invalid values and numerical range failures", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  await rectangle(page);
  for (const invalid of ["", "0", "-2", "NaN", "Infinity", "abc", "1e309"]) {
    await page.getByLabel("Length", { exact: true }).fill(invalid);
    await page.getByRole("button", { name: "Calculate Gravel" }).click();
    await expect(page.getByLabel("Length", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.getByLabel("Length", { exact: true })).toBeFocused();
    await expect(page.locator("#length-error")).toContainText(
      "Enter a length greater than 0",
    );
    await expect(
      page.getByRole("region", { name: "Estimated Volume" }),
    ).toHaveCount(0);
  }
  await rectangle(page, ["1e200", "1e200", "1e200"]);
  await page.getByRole("button", { name: "Calculate Gravel" }).click();
  await expect(page.getByRole("status")).toContainText(
    "too large or too small",
  );
  await expect(
    page.getByRole("region", { name: "Estimated Volume" }),
  ).toHaveCount(0);
});

test("project context does not change the formula; calculator never sends measurements", async ({
  page,
}) => {
  await page.goto("/gravel-calculator");
  const dataRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    // Next.js prefetches linked pages independently of calculator input.
    const navigationPrefetch =
      request.method() === "GET" &&
      url.origin === "http://localhost:3000" &&
      [
        "/",
        "/methodology",
        "/about",
        "/gravel-calculator",
        "/contact",
        "/privacy-policy",
        "/terms",
        "/disclaimer",
      ].includes(url.pathname) &&
      url.searchParams.has("_rsc") &&
      [...url.searchParams.keys()].every((key) => key === "_rsc");
    if (
      (["fetch", "xhr"].includes(request.resourceType()) &&
        !navigationPrefetch) ||
      request.method() !== "GET"
    )
      dataRequests.push(request.url());
  });
  await rectangle(page);
  for (const project of [
    "Driveway",
    "Path",
    "Patio Base",
    "Garden Area",
    "Custom",
  ]) {
    await page
      .getByLabel("Project type", { exact: true })
      .selectOption(project);
    await page.getByRole("button", { name: "Calculate Gravel" }).click();
    await expect(page.getByTestId("cubic-feet")).toHaveText("120.00 ft³");
  }
  expect(dataRequests).toEqual([]);
  await expect(page).toHaveURL(/\/gravel-calculator$/);
  await expect(
    page.locator('select#shape option[value="custom"]'),
  ).toBeDisabled();
});

for (const width of [375, 768, 1024, 1440]) {
  test(`results and errors are accessible and fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/gravel-calculator");
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.getByRole("button", { name: "Calculate Gravel" }).click();
    let audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    for (const shape of ["rectangle", "circle"]) {
      await rectangle(page);
      if (shape === "circle") {
        await page.getByLabel("Shape", { exact: true }).selectOption("circle");
        await page.getByLabel("Diameter", { exact: true }).fill("10");
      }
      await page.getByRole("button", { name: "Calculate Gravel" }).click();
      await expect(
        page.getByRole("region", { name: "Estimated Volume" }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
    }
    await rectangle(page, ["1e50", "1e50", "1e50"]);
    await page.getByRole("button", { name: "Calculate Gravel" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
