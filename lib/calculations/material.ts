import {
  CUBIC_FEET_PER_CUBIC_YARD,
  CUBIC_YARDS_PER_CUBIC_METER,
  requirePositiveFinite,
} from "../units/conversions";

export type ExistingVolumeUnit = "yd3" | "ft3" | "m3";
export type MaterialPlanInput = {
  baseCubicYards: number;
  allowancePercent: number;
  existingQuantity: number;
  existingUnit: ExistingVolumeUnit;
  densityShortTonsPerCubicYard: number;
};

export type MaterialPlanResult = {
  baseCubicYards: number;
  allowancePercent: number;
  allowanceCubicYards: number;
  plannedCubicYards: number;
  existingInputQuantity: number;
  existingInputUnit: ExistingVolumeUnit;
  existingCubicYards: number;
  remainingCubicYards: number;
  densityShortTonsPerCubicYard: number;
  shortTons: number;
  pounds: number;
  kilograms: number;
  metricTonnes: number;
};

export type MaterialFieldErrors = Partial<
  Record<"density" | "allowance" | "existingQuantity", string>
>;

export type MaterialFields = {
  density: string;
  allowance: string;
  hasExisting: boolean;
  existingQuantity: string;
  existingUnit: ExistingVolumeUnit;
};

export const SHORT_TON_POUNDS = 2000;
export const POUND_KILOGRAMS = 0.45359237;

function requireNonNegativeFinite(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite number of 0 or more.`);
  }
  return value;
}

export function parseFiniteDecimal(raw: string): number | null {
  const value = raw.trim();
  if (!/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) {
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const mantissa = value.split(/e/i)[0];
  if (number === 0 && /[1-9]/.test(mantissa)) return null;
  return number;
}

export function convertExistingVolumeToCubicYards(
  quantity: number,
  unit: ExistingVolumeUnit,
): number {
  const validQuantity = requireNonNegativeFinite(quantity, "Existing material");
  const cubicYards =
    unit === "yd3"
      ? validQuantity
      : unit === "ft3"
        ? validQuantity / CUBIC_FEET_PER_CUBIC_YARD
        : validQuantity * CUBIC_YARDS_PER_CUBIC_METER;
  return requireNonNegativeFinite(cubicYards, "Converted existing material");
}

export function validateMaterialFields(fields: MaterialFields):
  | {
      valid: true;
      value: Omit<MaterialPlanInput, "baseCubicYards">;
    }
  | { valid: false; errors: MaterialFieldErrors } {
  const errors: MaterialFieldErrors = {};
  const density = parseFiniteDecimal(fields.density);
  const allowance = parseFiniteDecimal(fields.allowance);
  const existingQuantity = fields.hasExisting
    ? parseFiniteDecimal(fields.existingQuantity)
    : 0;

  if (density === null || density <= 0) {
    errors.density = "Enter a density greater than 0 using a finite number.";
  }
  if (allowance === null || allowance < 0 || allowance > 100) {
    errors.allowance = "Enter an extra allowance from 0 to 100%.";
  }
  if (
    fields.hasExisting &&
    (existingQuantity === null || existingQuantity < 0)
  ) {
    errors.existingQuantity =
      "Enter an existing quantity of 0 or more using a finite number.";
  }
  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    value: {
      allowancePercent: allowance!,
      existingQuantity: existingQuantity!,
      existingUnit: fields.existingUnit,
      densityShortTonsPerCubicYard: density!,
    },
  };
}

export function calculateMaterialPlan(
  input: MaterialPlanInput,
): MaterialPlanResult {
  const baseCubicYards = requirePositiveFinite(input.baseCubicYards);
  const allowancePercent = requireNonNegativeFinite(
    input.allowancePercent,
    "Extra allowance",
  );
  if (allowancePercent > 100) {
    throw new RangeError("Extra allowance must not exceed 100%.");
  }
  const density = requirePositiveFinite(input.densityShortTonsPerCubicYard);
  const existingCubicYards = convertExistingVolumeToCubicYards(
    input.existingQuantity,
    input.existingUnit,
  );
  const allowanceCubicYards = requireNonNegativeFinite(
    baseCubicYards * (allowancePercent / 100),
    "Allowance volume",
  );
  const plannedCubicYards = requirePositiveFinite(
    baseCubicYards * (1 + allowancePercent / 100),
  );
  const remainingCubicYards = requireNonNegativeFinite(
    Math.max(0, plannedCubicYards - existingCubicYards),
    "Remaining volume",
  );
  const shortTons = requireNonNegativeFinite(
    remainingCubicYards * density,
    "Estimated short tons",
  );
  const pounds = requireNonNegativeFinite(
    shortTons * SHORT_TON_POUNDS,
    "Estimated pounds",
  );
  const kilograms = requireNonNegativeFinite(
    pounds * POUND_KILOGRAMS,
    "Estimated kilograms",
  );
  const metricTonnes = requireNonNegativeFinite(
    kilograms / 1000,
    "Estimated metric tonnes",
  );

  return {
    baseCubicYards,
    allowancePercent,
    allowanceCubicYards,
    plannedCubicYards,
    existingInputQuantity: input.existingQuantity,
    existingInputUnit: input.existingUnit,
    existingCubicYards,
    remainingCubicYards,
    densityShortTonsPerCubicYard: density,
    shortTons,
    pounds,
    kilograms,
    metricTonnes,
  };
}

export function formatPlanningNumber(value: number, decimals: number): string {
  requireNonNegativeFinite(value, "Displayed result");
  const threshold = 10 ** -decimals;
  if (value > 0 && value < threshold) return `<${threshold.toFixed(decimals)}`;
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1e9 ? "scientific" : "standard",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPlanningDetail(value: number): string {
  requireNonNegativeFinite(value, "Displayed detail");
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
    notation: value >= 1e9 ? "scientific" : "standard",
  }).format(value);
}
