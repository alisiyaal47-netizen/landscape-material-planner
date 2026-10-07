import { expect, test } from "@playwright/test";
import {
  calculateBagOption,
  calculateBulkOption,
  comparePurchaseOptions,
  formatCurrency,
  roundUpToIncrement,
  validatePurchaseFields,
  type PurchaseFields,
} from "../lib/calculations/purchase";

test("weight-based bags match the supplied 4.38 yd³ example", () => {
  const bag = calculateBagOption({
    remainingCubicYards: 4.38,
    densityShortTonsPerCubicYard: 1.4,
    bagWeightPounds: 50,
    bagPrice: 5.99,
  });
  expect(bag.volumeSource).toBe("weight-density");
  expect(bag.bagVolumeCubicYards).toBeCloseTo(0.017857142857, 12);
  expect(bag.bagsNeeded).toBe(246);
  expect(bag.materialCost).toBeCloseTo(1473.54, 10);
  expect(bag.purchasedCubicYards).toBeCloseTo(4.392857142857, 12);
  expect(bag.leftoverCubicYards).toBeCloseTo(0.012857142857, 12);
  expect(formatCurrency(bag.materialCost)).toBe("$1,473.54");
});

test("bulk option matches the supplied price, increment and delivery example", () => {
  const bulk = calculateBulkOption({
    remainingCubicYards: 4.38,
    pricePerCubicYard: 52,
    minimumOrderCubicYards: 1,
    orderIncrementCubicYards: 0.5,
    deliveryFee: 75,
  });
  expect(bulk.requiredOrderCubicYards).toBe(4.38);
  expect(bulk.orderCubicYards).toBe(4.5);
  expect(bulk.materialCost).toBe(234);
  expect(bulk.totalCost).toBe(309);
  expect(bulk.leftoverCubicYards).toBeCloseTo(0.12, 12);
});

test("minimum order applies before increment rounding", () => {
  const bulk = calculateBulkOption({
    remainingCubicYards: 0.4,
    pricePerCubicYard: 52,
    minimumOrderCubicYards: 1,
    orderIncrementCubicYards: 0.5,
    deliveryFee: 0,
  });
  expect(bulk.requiredOrderCubicYards).toBe(1);
  expect(bulk.orderCubicYards).toBe(1);
  expect(bulk.leftoverCubicYards).toBeCloseTo(0.6, 12);
});

test("orders round up to the supplier increment without over-rounding exact multiples", () => {
  expect(roundUpToIncrement(4.01, 0.5)).toBe(4.5);
  expect(roundUpToIncrement(4.5, 0.5)).toBe(4.5);
  expect(roundUpToIncrement(0, 0.5)).toBe(0);
  expect(roundUpToIncrement(0.3, 0.1)).toBeCloseTo(0.3, 14);
});

test("direct bag label volume takes priority over a supplied bag weight", () => {
  const bag = calculateBagOption({
    remainingCubicYards: 4.38,
    densityShortTonsPerCubicYard: 1.4,
    bagWeightPounds: 100,
    bagPrice: 5,
    bagVolumeCubicFeet: 0.5,
  });
  expect(bag.volumeSource).toBe("label-volume");
  expect(bag.bagVolumeCubicFeet).toBe(0.5);
  expect(bag.bagVolumeCubicYards).toBeCloseTo(0.5 / 27, 14);
  expect(bag.bagsNeeded).toBe(237);
});

test("bag label volume works without bag weight", () => {
  const validation = validatePurchaseFields({
    bagWeight: "",
    bagPrice: "5.99",
    bagVolume: "0.5",
    bulkPrice: "52",
    minimumOrder: "1",
    orderIncrement: "0.5",
    deliveryFee: "75",
  });
  expect(validation.valid).toBe(true);
  if (validation.valid) {
    expect(validation.value.bagWeightPounds).toBeUndefined();
    expect(validation.value.bagVolumeCubicFeet).toBe(0.5);
  }
});

test("equal costs produce an equal comparison", () => {
  const bag = calculateBagOption({
    remainingCubicYards: 1,
    densityShortTonsPerCubicYard: 1.4,
    bagVolumeCubicFeet: 27,
    bagPrice: 100,
  });
  const bulk = calculateBulkOption({
    remainingCubicYards: 1,
    pricePerCubicYard: 100,
    minimumOrderCubicYards: 0,
    orderIncrementCubicYards: 1,
    deliveryFee: 0,
  });
  expect(comparePurchaseOptions(bag, bulk)).toEqual({
    lowerCostOption: "equal",
    difference: 0,
  });
});

test("positive sub-cent prices never display as zero", () => {
  expect(formatCurrency(0.001)).toBe("<$0.01");

  const bag = calculateBagOption({
    remainingCubicYards: 1,
    densityShortTonsPerCubicYard: 1.4,
    bagVolumeCubicFeet: 27,
    bagPrice: 0.001,
  });
  const bulk = calculateBulkOption({
    remainingCubicYards: 1,
    pricePerCubicYard: 0,
    minimumOrderCubicYards: 0,
    orderIncrementCubicYards: 1,
    deliveryFee: 0,
  });
  const comparison = comparePurchaseOptions(bag, bulk);

  expect(comparison.lowerCostOption).toBe("equal");
  expect(formatCurrency(comparison.difference)).toBe("<$0.01");
});

test("comparison reports the lower entered cost and absolute difference", () => {
  const bag = calculateBagOption({
    remainingCubicYards: 4.38,
    densityShortTonsPerCubicYard: 1.4,
    bagWeightPounds: 50,
    bagPrice: 5.99,
  });
  const bulk = calculateBulkOption({
    remainingCubicYards: 4.38,
    pricePerCubicYard: 52,
    minimumOrderCubicYards: 1,
    orderIncrementCubicYards: 0.5,
    deliveryFee: 75,
  });
  expect(comparePurchaseOptions(bag, bulk)).toEqual({
    lowerCostOption: "bulk",
    difference: 1164.54,
  });
});

test("bag count does not add a bag at a floating-point exact-volume boundary", () => {
  const bag = calculateBagOption({
    remainingCubicYards: 0.30000000000000004,
    densityShortTonsPerCubicYard: 1.4,
    bagVolumeCubicFeet: 2.7,
    bagPrice: 1,
  });

  expect(bag.bagsNeeded).toBe(3);
});

test("costs that display to the same cent compare as equal", () => {
  const bag = calculateBagOption({
    remainingCubicYards: 0.30000000000000004,
    densityShortTonsPerCubicYard: 1.4,
    bagVolumeCubicFeet: 2.7,
    bagPrice: 0.1,
  });
  const bulk = calculateBulkOption({
    remainingCubicYards: 0.3,
    pricePerCubicYard: 1,
    minimumOrderCubicYards: 0,
    orderIncrementCubicYards: 0.3,
    deliveryFee: 0,
  });

  expect(formatCurrency(bag.materialCost)).toBe(formatCurrency(bulk.totalCost));
  const comparison = comparePurchaseOptions(bag, bulk);
  expect(comparison.difference).toBe(
    Math.abs(bag.materialCost - bulk.totalCost),
  );
  expect(formatCurrency(comparison.difference)).toBe("<$0.01");
});

const validFields: PurchaseFields = {
  bagWeight: "50",
  bagPrice: "5.99",
  bagVolume: "",
  bulkPrice: "52",
  minimumOrder: "1",
  orderIncrement: "0.5",
  deliveryFee: "75",
};

for (const [field, invalidValues] of Object.entries({
  bagWeight: ["0", "-1", "NaN", "Infinity", "1e309", "1e-999"],
  bagPrice: ["", "-1", "NaN", "Infinity", "1e309", "1e-999"],
  bagVolume: ["0", "-1", "NaN", "Infinity", "1e309", "1e-999"],
  bulkPrice: ["", "-1", "NaN", "Infinity", "1e309", "1e-999"],
  minimumOrder: ["", "-1", "NaN", "Infinity", "1e309", "1e-999"],
  orderIncrement: ["", "0", "-1", "NaN", "Infinity", "1e309", "1e-999"],
  deliveryFee: ["", "-1", "NaN", "Infinity", "1e309", "1e-999"],
}) as [keyof PurchaseFields, string[]][]) {
  for (const invalid of invalidValues) {
    test(
      "reject " + field + " value " + JSON.stringify(invalid),
      () => {
        const validation = validatePurchaseFields({
          ...validFields,
          [field]: invalid,
        });
        expect(validation.valid).toBe(false);
        if (!validation.valid) expect(validation.errors[field]).toBeTruthy();
      },
    );
  }
}

test("bag weight or volume is required, but neither is forced when the other is valid", () => {
  const neither = validatePurchaseFields({
    ...validFields,
    bagWeight: "",
    bagVolume: "",
  });
  expect(neither.valid).toBe(false);
  if (!neither.valid) expect(neither.errors.bagWeight).toContain("or");

  const weightOnly = validatePurchaseFields(validFields);
  expect(weightOnly.valid).toBe(true);
  const volumeOnly = validatePurchaseFields({
    ...validFields,
    bagWeight: "",
    bagVolume: "0.5",
  });
  expect(volumeOnly.valid).toBe(true);
});

test("leftover volumes never become negative", () => {
  const bag = calculateBagOption({
    remainingCubicYards: 1,
    densityShortTonsPerCubicYard: 1.4,
    bagVolumeCubicFeet: 27,
    bagPrice: 0,
  });
  const bulk = calculateBulkOption({
    remainingCubicYards: 1,
    pricePerCubicYard: 0,
    minimumOrderCubicYards: 0,
    orderIncrementCubicYards: 1,
    deliveryFee: 0,
  });
  expect(bag.leftoverCubicYards).toBe(0);
  expect(bulk.leftoverCubicYards).toBe(0);
});

test("pure purchase functions reject invalid direct inputs and overflow", () => {
  expect(() =>
    calculateBagOption({
      remainingCubicYards: 1,
      densityShortTonsPerCubicYard: 0,
      bagWeightPounds: 50,
      bagPrice: 5,
    }),
  ).toThrow(RangeError);
  expect(() =>
    calculateBagOption({
      remainingCubicYards: 1,
      densityShortTonsPerCubicYard: 1.4,
      bagWeightPounds: -1,
      bagVolumeCubicFeet: 0.5,
      bagPrice: 5,
    }),
  ).toThrow(RangeError);
  expect(() => roundUpToIncrement(1, 0)).toThrow(RangeError);
  expect(() =>
    calculateBulkOption({
      remainingCubicYards: 1e308,
      pricePerCubicYard: 1e308,
      minimumOrderCubicYards: 0,
      orderIncrementCubicYards: 1,
      deliveryFee: 0,
    }),
  ).toThrow(RangeError);
});
