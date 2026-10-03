import {
  convertLengthToMeters,
  convertCubicMetersToCubicFeet,
  convertCubicMetersToCubicYards,
  requirePositiveFinite,
  type LengthUnit,
} from "../units/conversions";

export type ShapeType = "rectangle" | "circle";
export type MeasurementKey = "length" | "width" | "diameter" | "depth";
export type Measurement = { value: number; unit: LengthUnit };
export type MeasurementField = { value: string; unit: LengthUnit };
export type MeasurementFields = Record<MeasurementKey, MeasurementField>;
export type MeasurementErrors = Partial<Record<MeasurementKey, string>>;
export type VolumeInput =
  | {
      shape: "rectangle";
      length: Measurement;
      width: Measurement;
      depth: Measurement;
    }
  | { shape: "circle"; diameter: Measurement; depth: Measurement };

export const SHAPE_FIELDS: Record<ShapeType, readonly MeasurementKey[]> = {
  rectangle: ["length", "width", "depth"],
  circle: ["diameter", "depth"],
};

export function parsePositiveMeasurement(raw: string): number | null {
  const value = raw.trim();
  // Accept decimals and scientific notation, but not partial parses, hex or commas.
  if (!/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function validateMeasurements(
  shape: ShapeType,
  fields: MeasurementFields,
):
  | { valid: true; input: VolumeInput }
  | { valid: false; errors: MeasurementErrors } {
  const errors: MeasurementErrors = {};
  for (const key of SHAPE_FIELDS[shape]) {
    if (parsePositiveMeasurement(fields[key].value) === null) {
      errors[key] = `Enter a ${key} greater than 0 using a finite number.`;
    }
  }
  if (Object.keys(errors).length) return { valid: false, errors };
  const measurement = (key: MeasurementKey): Measurement => ({
    value: Number(fields[key].value.trim()),
    unit: fields[key].unit,
  });
  return {
    valid: true,
    input:
      shape === "rectangle"
        ? {
            shape,
            length: measurement("length"),
            width: measurement("width"),
            depth: measurement("depth"),
          }
        : {
            shape,
            diameter: measurement("diameter"),
            depth: measurement("depth"),
          },
  };
}

export function calculateRectangleVolume(
  lengthMeters: number,
  widthMeters: number,
  depthMeters: number,
): number {
  return requirePositiveFinite(
    requirePositiveFinite(lengthMeters) *
      requirePositiveFinite(widthMeters) *
      requirePositiveFinite(depthMeters),
  );
}

export function calculateCircleVolume(
  diameterMeters: number,
  depthMeters: number,
): number {
  const radius = requirePositiveFinite(diameterMeters) / 2;
  return requirePositiveFinite(
    Math.PI * radius ** 2 * requirePositiveFinite(depthMeters),
  );
}

type NormalizedDimensions =
  | { shape: "rectangle"; length: number; width: number; depth: number }
  | { shape: "circle"; diameter: number; radius: number; depth: number };
export type VolumeResult = {
  input: VolumeInput;
  meters: NormalizedDimensions;
  cubicMeters: number;
  cubicFeet: number;
  cubicYards: number;
};

export function calculateVolume(input: VolumeInput): VolumeResult {
  const toMeters = (measurement: Measurement) =>
    convertLengthToMeters(measurement.value, measurement.unit);
  const depth = toMeters(input.depth);
  const meters: NormalizedDimensions =
    input.shape === "rectangle"
      ? {
          shape: input.shape,
          length: toMeters(input.length),
          width: toMeters(input.width),
          depth,
        }
      : {
          shape: input.shape,
          diameter: toMeters(input.diameter),
          radius: toMeters(input.diameter) / 2,
          depth,
        };
  const cubicMeters =
    meters.shape === "rectangle"
      ? calculateRectangleVolume(meters.length, meters.width, depth)
      : calculateCircleVolume(meters.diameter, depth);
  return {
    input,
    meters,
    cubicMeters,
    cubicFeet: convertCubicMetersToCubicFeet(cubicMeters),
    cubicYards: convertCubicMetersToCubicYards(cubicMeters),
  };
}

export type VolumeUnit = "ft3" | "yd3" | "m3";
const DISPLAY_DECIMALS: Record<VolumeUnit, number> = { ft3: 2, yd3: 2, m3: 3 };

export function formatVolume(value: number, unit: VolumeUnit): string {
  requirePositiveFinite(value);
  const decimals = DISPLAY_DECIMALS[unit];
  const minimum = 10 ** -decimals;
  // Do not label a small, positive volume as zero. Very large values stay readable.
  if (value < minimum) return `<${minimum.toFixed(decimals)}`;
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1e9 ? "scientific" : "standard",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatMeasurement(value: number): string {
  requirePositiveFinite(value);
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 8,
    notation: value < 0.000001 || value >= 1e9 ? "scientific" : "standard",
  }).format(value);
}
