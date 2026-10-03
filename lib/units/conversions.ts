export const METERS_PER_UNIT = {
  ft: 0.3048,
  in: 0.0254,
  m: 1,
  cm: 0.01,
} as const;
export type LengthUnit = keyof typeof METERS_PER_UNIT;

export const LENGTH_UNITS: ReadonlyArray<{ value: LengthUnit; label: string }> =
  [
    { value: "ft", label: "Feet" },
    { value: "in", label: "Inches" },
    { value: "m", label: "Meters" },
    { value: "cm", label: "Centimeters" },
  ];

// Derive volume conversions from the exact international foot definition.
export const CUBIC_FEET_PER_CUBIC_METER = 1 / METERS_PER_UNIT.ft ** 3;
export const CUBIC_FEET_PER_CUBIC_YARD = 27;
export const CUBIC_YARDS_PER_CUBIC_METER =
  CUBIC_FEET_PER_CUBIC_METER / CUBIC_FEET_PER_CUBIC_YARD;

export function requirePositiveFinite(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(
      "Measurements and volumes must be finite numbers greater than 0.",
    );
  }
  return value;
}

export function convertLengthToMeters(value: number, unit: LengthUnit): number {
  return requirePositiveFinite(
    requirePositiveFinite(value) * METERS_PER_UNIT[unit],
  );
}

export function convertLength(
  value: number,
  fromUnit: LengthUnit,
  toUnit: LengthUnit,
): number {
  return requirePositiveFinite(
    convertLengthToMeters(value, fromUnit) / METERS_PER_UNIT[toUnit],
  );
}

export function convertCubicMetersToCubicFeet(value: number): number {
  return requirePositiveFinite(
    requirePositiveFinite(value) * CUBIC_FEET_PER_CUBIC_METER,
  );
}

export function convertCubicMetersToCubicYards(value: number): number {
  return requirePositiveFinite(
    requirePositiveFinite(value) * CUBIC_YARDS_PER_CUBIC_METER,
  );
}
