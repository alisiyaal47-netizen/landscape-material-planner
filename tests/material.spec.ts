import { expect, test } from "@playwright/test";
import {
  calculateMaterialPlan,
  convertExistingVolumeToCubicYards,
  formatPlanningDetail,
  formatPlanningNumber,
  parseFiniteDecimal,
  validateMaterialFields,
  type MaterialFields,
} from "../lib/calculations/material";
import {
  DEFAULT_GRAVEL_DENSITY,
  DEFAULT_GRAVEL_MATERIAL_ID,
  GRAVEL_MATERIALS,
  getGravelMaterial,
} from "../lib/materials/gravel";

test("gravel presets are centralized with the required planning densities", () => {
  expect(GRAVEL_MATERIALS).toEqual([
    { id: "general-gravel", name: "General Gravel", density: 1.4 },
    { id: "pea-gravel", name: "Pea Gravel", density: 1.35 },
    { id: "crushed-stone-57", name: "Crushed Stone #57", density: 1.4 },
    { id: "crusher-run", name: "Crusher Run / Road Base", density: 1.45 },
    { id: "river-rock", name: "River Rock", density: 1.5 },
    { id: "decomposed-granite", name: "Decomposed Granite", density: 1.4 },
    { id: "crushed-limestone", name: "Crushed Limestone", density: 1.4 },
    { id: "lava-rock", name: "Lava Rock", density: 0.75 },
    { id: "custom", name: "Custom", density: null },
  ]);
  expect(DEFAULT_GRAVEL_MATERIAL_ID).toBe("general-gravel");
  expect(DEFAULT_GRAVEL_DENSITY).toBe(1.4);
  expect(getGravelMaterial("river-rock").density).toBe(1.5);
});

test("main material-planning example applies allowance, stock and density in order", () => {
  const result = calculateMaterialPlan({
    baseCubicYards: 120 / 27,
    allowancePercent: 10,
    existingQuantity: 0.5,
    existingUnit: "yd3",
    densityShortTonsPerCubicYard: 1.4,
  });
  expect(result.baseCubicYards).toBeCloseTo(4.444444444, 9);
  expect(result.allowanceCubicYards).toBeCloseTo(0.444444444, 9);
  expect(result.plannedCubicYards).toBeCloseTo(4.888888889, 9);
  expect(result.existingCubicYards).toBe(0.5);
  expect(result.remainingCubicYards).toBeCloseTo(4.388888889, 9);
  expect(result.shortTons).toBeCloseTo(6.144444444, 9);
  expect(result.pounds).toBeCloseTo(12288.888889, 6);
  expect(result.metricTonnes).toBeCloseTo(5.574146236, 6);
  expect(formatPlanningNumber(result.pounds, 2)).toBe("12,288.89");
  expect(formatPlanningNumber(result.metricTonnes, 3)).toBe("5.574");
  expect(formatPlanningDetail(result.shortTons)).toBe("6.144444");
});

test("zero allowance leaves base volume unchanged", () => {
  const result = calculateMaterialPlan({
    baseCubicYards: 4,
    allowancePercent: 0,
    existingQuantity: 0,
    existingUnit: "yd3",
    densityShortTonsPerCubicYard: 1.4,
  });
  expect(result.allowanceCubicYards).toBe(0);
  expect(result.plannedCubicYards).toBe(4);
  expect(result.remainingCubicYards).toBe(4);
});

test("existing material above planned volume clamps remaining and weight to zero", () => {
  const result = calculateMaterialPlan({
    baseCubicYards: 4,
    allowancePercent: 10,
    existingQuantity: 10,
    existingUnit: "yd3",
    densityShortTonsPerCubicYard: 1.4,
  });
  expect(result.remainingCubicYards).toBe(0);
  expect(result.shortTons).toBe(0);
  expect(result.pounds).toBe(0);
  expect(result.metricTonnes).toBe(0);
  expect(formatPlanningNumber(result.remainingCubicYards, 2)).toBe("0.00");
});

test("existing volume units convert to cubic yards", () => {
  expect(convertExistingVolumeToCubicYards(27, "ft3")).toBe(1);
  expect(convertExistingVolumeToCubicYards(1, "yd3")).toBe(1);
  expect(convertExistingVolumeToCubicYards(1, "m3")).toBeCloseTo(
    1.30795061931439,
    12,
  );
});

test("custom density changes weight without changing remaining volume", () => {
  const common = {
    baseCubicYards: 5,
    allowancePercent: 10,
    existingQuantity: 0.5,
    existingUnit: "yd3" as const,
  };
  const preset = calculateMaterialPlan({
    ...common,
    densityShortTonsPerCubicYard: 1.4,
  });
  const custom = calculateMaterialPlan({
    ...common,
    densityShortTonsPerCubicYard: 1.72,
  });
  expect(custom.remainingCubicYards).toBe(preset.remainingCubicYards);
  expect(custom.shortTons).toBeCloseTo(custom.remainingCubicYards * 1.72, 12);
  expect(custom.shortTons).toBeGreaterThan(preset.shortTons);
});

const validFields: MaterialFields = {
  density: "1.40",
  allowance: "10",
  hasExisting: true,
  existingQuantity: "0.5",
  existingUnit: "yd3",
};

for (const invalid of ["", "0", "-1", "NaN", "Infinity", "1e309", "1e-999"] ) {
  test(`reject invalid density ${JSON.stringify(invalid)}`, () => {
    const validation = validateMaterialFields({ ...validFields, density: invalid });
    expect(validation.valid).toBe(false);
    if (!validation.valid) expect(validation.errors.density).toContain("greater than 0");
  });
}

for (const invalid of ["", "-1", "100.01", "NaN", "Infinity", "1e309", "1e-999"]) {
  test(`reject invalid allowance ${JSON.stringify(invalid)}`, () => {
    const validation = validateMaterialFields({ ...validFields, allowance: invalid });
    expect(validation.valid).toBe(false);
    if (!validation.valid) expect(validation.errors.allowance).toContain("0 to 100%");
  });
}

for (const invalid of ["", "-0.1", "NaN", "Infinity", "1e309", "1e-999"]) {
  test(`reject invalid existing quantity ${JSON.stringify(invalid)}`, () => {
    const validation = validateMaterialFields({ ...validFields, existingQuantity: invalid });
    expect(validation.valid).toBe(false);
    if (!validation.valid) expect(validation.errors.existingQuantity).toContain("0 or more");
  });
}

test("existing quantity is ignored when the user selects No", () => {
  const validation = validateMaterialFields({
    ...validFields,
    hasExisting: false,
    existingQuantity: "invalid hidden value",
  });
  expect(validation.valid).toBe(true);
  if (validation.valid) expect(validation.value.existingQuantity).toBe(0);
});

test("material calculations reject direct invalid and overflow inputs", () => {
  const base = {
    baseCubicYards: 1,
    allowancePercent: 10,
    existingQuantity: 0,
    existingUnit: "yd3" as const,
    densityShortTonsPerCubicYard: 1.4,
  };
  expect(() => calculateMaterialPlan({ ...base, allowancePercent: 101 })).toThrow(
    RangeError,
  );
  expect(() =>
    calculateMaterialPlan({ ...base, densityShortTonsPerCubicYard: 0 }),
  ).toThrow(RangeError);
  expect(() =>
    calculateMaterialPlan({ ...base, existingQuantity: -1 }),
  ).toThrow(RangeError);
  expect(() =>
    calculateMaterialPlan({
      ...base,
      baseCubicYards: 1e308,
      allowancePercent: 100,
    }),
  ).toThrow(RangeError);
  expect(parseFiniteDecimal("2.75")).toBe(2.75);
  expect(parseFiniteDecimal("0")).toBe(0);
  expect(parseFiniteDecimal("1e-999")).toBeNull();
});
