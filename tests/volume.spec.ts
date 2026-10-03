import { expect, test } from "@playwright/test";
import {
  calculateCircleVolume,
  calculateRectangleVolume,
  calculateVolume,
  formatVolume,
  parsePositiveMeasurement,
  validateMeasurements,
  type MeasurementFields,
  type VolumeInput,
} from "../lib/calculations/volume";
import {
  convertLength,
  convertLengthToMeters,
  convertCubicMetersToCubicFeet,
  convertCubicMetersToCubicYards,
} from "../lib/units/conversions";

const cases: {
  name: string;
  input: VolumeInput;
  feet: number;
  yards: number;
  meters: number;
  displayed: string[];
}[] = [
  {
    name: "40 ft × 12 ft × 3 in",
    input: {
      shape: "rectangle",
      length: { value: 40, unit: "ft" },
      width: { value: 12, unit: "ft" },
      depth: { value: 3, unit: "in" },
    },
    feet: 120,
    yards: 120 / 27,
    meters: 3.39802159104,
    displayed: ["120.00", "4.44", "3.398"],
  },
  {
    name: "10 m × 5 m × 10 cm",
    input: {
      shape: "rectangle",
      length: { value: 10, unit: "m" },
      width: { value: 5, unit: "m" },
      depth: { value: 10, unit: "cm" },
    },
    feet: 176.573333607,
    yards: 6.53975309657,
    meters: 5,
    displayed: ["176.57", "6.54", "5.000"],
  },
  {
    name: "12 ft × 10 ft × 6 in",
    input: {
      shape: "rectangle",
      length: { value: 12, unit: "ft" },
      width: { value: 10, unit: "ft" },
      depth: { value: 6, unit: "in" },
    },
    feet: 60,
    yards: 60 / 27,
    meters: 1.69901079552,
    displayed: ["60.00", "2.22", "1.699"],
  },
  {
    name: "circle 10 ft diameter × 3 in depth",
    input: {
      shape: "circle",
      diameter: { value: 10, unit: "ft" },
      depth: { value: 3, unit: "in" },
    },
    feet: Math.PI * 25 * 0.25,
    yards: (Math.PI * 25 * 0.25) / 27,
    meters: 0.5559999826641023,
    displayed: ["19.63", "0.73", "0.556"],
  },
  {
    name: "decimal inputs 12.5 ft × 7.25 ft × 2.5 in",
    input: {
      shape: "rectangle",
      length: { value: 12.5, unit: "ft" },
      width: { value: 7.25, unit: "ft" },
      depth: { value: 2.5, unit: "in" },
    },
    feet: 18.8802083333333,
    yards: 0.699266975308642,
    meters: 0.534627963,
    displayed: ["18.88", "0.70", "0.535"],
  },
];

for (const example of cases) {
  test(`calculation: ${example.name}`, () => {
    const result = calculateVolume(example.input);
    expect(result.cubicFeet).toBeCloseTo(example.feet, 8);
    expect(result.cubicYards).toBeCloseTo(example.yards, 8);
    expect(result.cubicMeters).toBeCloseTo(example.meters, 8);
    expect([
      formatVolume(result.cubicFeet, "ft3"),
      formatVolume(result.cubicYards, "yd3"),
      formatVolume(result.cubicMeters, "m3"),
    ]).toEqual(example.displayed);
  });
}

test("centralized unit conversions use the exact length definitions", () => {
  expect(convertLengthToMeters(1, "ft")).toBe(0.3048);
  expect(convertLengthToMeters(1, "in")).toBe(0.0254);
  expect(convertLengthToMeters(1, "cm")).toBe(0.01);
  expect(convertLengthToMeters(1, "m")).toBe(1);
  expect(convertLength(3, "in", "ft")).toBeCloseTo(0.25, 14);
  expect(convertLength(100, "cm", "m")).toBeCloseTo(1, 14);
  expect(convertCubicMetersToCubicFeet(1)).toBeCloseTo(35.3146667214886, 10);
  expect(convertCubicMetersToCubicYards(1)).toBeCloseTo(1.30795061931439, 10);
  const mixed = calculateVolume({
    shape: "rectangle",
    length: { value: 100, unit: "cm" },
    width: { value: 1, unit: "m" },
    depth: { value: 100, unit: "cm" },
  });
  expect(mixed.cubicMeters).toBe(1);
  const circle = calculateVolume({
    shape: "circle",
    diameter: { value: 200, unit: "cm" },
    depth: { value: 1, unit: "m" },
  });
  expect(circle.cubicMeters).toBe(Math.PI);
});

for (const raw of [
  "",
  " ",
  "0",
  "-1",
  "NaN",
  "Infinity",
  "-Infinity",
  "12abc",
  "0x10",
  "1,5",
  "1e309",
  "1e-999",
  "--3",
]) {
  test(`reject invalid measurement ${JSON.stringify(raw)}`, () => {
    expect(parsePositiveMeasurement(raw)).toBeNull();
    const fields: MeasurementFields = {
      length: { value: raw, unit: "ft" },
      width: { value: "12", unit: "ft" },
      depth: { value: "3", unit: "in" },
      diameter: { value: "10", unit: "ft" },
    };
    const validation = validateMeasurements("rectangle", fields);
    expect(validation.valid).toBe(false);
    if (!validation.valid)
      expect(validation.errors.length).toContain("greater than 0");
    // Hidden rectangle fields do not affect the selected circle.
    expect(validateMeasurements("circle", fields).valid).toBe(true);
  });
}

test("pure functions reject non-positive, non-finite, overflow and underflow results", () => {
  for (const invalid of [0, -1, NaN, Infinity, -Infinity]) {
    expect(() => calculateRectangleVolume(invalid, 1, 1)).toThrow(RangeError);
    expect(() => calculateCircleVolume(1, invalid)).toThrow(RangeError);
    expect(() => convertLengthToMeters(invalid, "m")).toThrow(RangeError);
  }
  expect(() => calculateRectangleVolume(1e200, 1e200, 1e200)).toThrow(
    RangeError,
  );
  expect(() => calculateCircleVolume(1e-200, 1e-200)).toThrow(RangeError);
});

test("formatting preserves internal precision and makes tiny or huge estimates explicit", () => {
  const result = calculateVolume(cases[0].input);
  const unrounded = result.cubicYards;
  expect(formatVolume(unrounded, "yd3")).toBe("4.44");
  expect(result.cubicYards).toBe(unrounded);
  expect(result.cubicYards).not.toBe(4.44);
  expect(formatVolume(0.000004, "m3")).toBe("<0.001");
  expect(formatVolume(0.004, "ft3")).toBe("<0.01");
  expect(formatVolume(1e30, "yd3")).toBe("1.00E30");
  expect(parsePositiveMeasurement(" 2.75 ")).toBe(2.75);
  expect(parsePositiveMeasurement(".5")).toBe(0.5);
});
