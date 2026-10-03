import { expect, test } from "@playwright/test";
import { calculateMaterialPlan } from "../lib/calculations/material";
import {
  calculateBagOption,
  calculateBulkOption,
  comparePurchaseOptions,
} from "../lib/calculations/purchase";
import { calculateVolume } from "../lib/calculations/volume";
import {
  buildProjectPlanText,
  formatBagPurchaseQuantity,
  getEnteredOptionStatement,
  type ProjectPlanSnapshot,
} from "../lib/project/plan";

function mainSnapshot(): ProjectPlanSnapshot {
  const volume = calculateVolume({
    shape: "rectangle",
    length: { value: 40, unit: "ft" },
    width: { value: 12, unit: "ft" },
    depth: { value: 3, unit: "in" },
  });
  const material = calculateMaterialPlan({
    baseCubicYards: volume.cubicYards,
    allowancePercent: 10,
    existingQuantity: 0.5,
    existingUnit: "yd3",
    densityShortTonsPerCubicYard: 1.4,
  });
  const bag = calculateBagOption({
    remainingCubicYards: material.remainingCubicYards,
    densityShortTonsPerCubicYard: material.densityShortTonsPerCubicYard,
    bagWeightPounds: 50,
    bagPrice: 5.99,
  });
  const bulk = calculateBulkOption({
    remainingCubicYards: material.remainingCubicYards,
    pricePerCubicYard: 52,
    minimumOrderCubicYards: 1,
    orderIncrementCubicYards: 0.5,
    deliveryFee: 75,
  });
  return {
    projectType: "Driveway",
    volume,
    material,
    materialName: "General Gravel",
    purchase: {
      bag,
      bulk,
      comparison: comparePurchaseOptions(bag, bulk),
      inputs: {
        bagWeightPounds: 50,
        bagPrice: 5.99,
        pricePerCubicYard: 52,
        minimumOrderCubicYards: 1,
        orderIncrementCubicYards: 0.5,
        deliveryFee: 75,
      },
    },
  };
}

test("plain-text project plan combines the existing calculation snapshots", () => {
  const snapshot = mainSnapshot();
  const text = buildProjectPlanText(snapshot);
  expect(text).toContain("Gravel Project Plan");
  expect(text).toContain("Project: Driveway");
  expect(text).toContain("Measurements: 40 ft × 12 ft × 3 in");
  expect(text).toContain("Material: General Gravel");
  expect(text).toContain("Remaining: 4.39 yd³");
  expect(text).toContain("Estimated weight: 6.14 US short tons");
  expect(text).toContain("246 × 50 lb bags");
  expect(text).toContain("Estimated cost: $1,473.54");
  expect(text).toContain("4.5 yd³ bulk");
  expect(text).toContain("Estimated total: $309.00");
  expect(text).toContain("Lower entered cost: Bulk");
  expect(text).toContain("Difference: $1,164.54");
  expect(text).toContain("Planning estimates only.");
  expect(formatBagPurchaseQuantity(snapshot.purchase!)).toBe(
    "246 × 50 lb bags",
  );
});

test("recommendation wording handles bags, bulk and equal costs", () => {
  expect(
    getEnteredOptionStatement({ lowerCostOption: "bags", difference: 10 }),
  ).toBe("Based on your entered values, bags have the lower estimated cost.");
  expect(
    getEnteredOptionStatement({ lowerCostOption: "bulk", difference: 10 }),
  ).toBe("Based on your entered values, bulk has the lower estimated cost.");
  expect(
    getEnteredOptionStatement({ lowerCostOption: "equal", difference: 0 }),
  ).toBe("Both options have the same estimated entered cost.");
});

test("zero-need text omits purchase recommendations", () => {
  const snapshot = mainSnapshot();
  snapshot.material = calculateMaterialPlan({
    baseCubicYards: snapshot.volume.cubicYards,
    allowancePercent: 10,
    existingQuantity: 100,
    existingUnit: "yd3",
    densityShortTonsPerCubicYard: 1.4,
  });
  snapshot.purchase = undefined;
  const text = buildProjectPlanText(snapshot);
  expect(text).toContain("Purchase needed: 0");
  expect(text).toContain(
    "Your entered existing material covers the estimated requirement.",
  );
  expect(text).not.toContain("Lower entered cost:");
  expect(text).not.toContain("Recommended entered option");
});
