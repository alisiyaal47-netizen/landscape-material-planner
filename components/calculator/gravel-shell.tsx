"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LENGTH_UNITS, type LengthUnit } from "@/lib/units/conversions";
import {
  calculateVolume,
  formatVolume,
  SHAPE_FIELDS,
  validateMeasurements,
  type MeasurementErrors,
  type MeasurementFields,
  type MeasurementKey,
  type ShapeType,
  type VolumeResult,
} from "@/lib/calculations/volume";
import { VolumeResults } from "./volume-results";

const initialFields = (): MeasurementFields => ({
  length: { value: "", unit: "ft" },
  width: { value: "", unit: "ft" },
  diameter: { value: "", unit: "ft" },
  depth: { value: "", unit: "in" },
});
const labels: Record<MeasurementKey, string> = {
  length: "Length",
  width: "Width",
  diameter: "Diameter",
  depth: "Depth",
};

export function GravelShell() {
  const [shape, setShape] = useState<ShapeType>("rectangle");
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<MeasurementErrors>({});
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState<VolumeResult | null>(null);
  const [announcement, setAnnouncement] = useState("");

  function invalidate() {
    if (result)
      setAnnouncement(
        "Measurements changed. Calculate again for an updated estimate.",
      );
    setResult(null);
    setFormError("");
  }

  function updateField(
    key: MeasurementKey,
    change: Partial<MeasurementFields[MeasurementKey]>,
  ) {
    setFields((current) => ({
      ...current,
      [key]: { ...current[key], ...change },
    }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    invalidate();
  }

  function changeShape(nextShape: ShapeType) {
    setShape(nextShape);
    setFields((current) => ({
      ...current,
      length: { ...current.length, value: "" },
      width: { ...current.width, value: "" },
      diameter: { ...current.diameter, value: "" },
    }));
    setErrors({});
    invalidate();
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateMeasurements(shape, fields);
    setResult(null);
    setFormError("");
    if (!validation.valid) {
      setErrors(validation.errors);
      setAnnouncement(
        "Check the highlighted measurements. Each must be a finite number greater than zero.",
      );
      const firstInvalid = SHAPE_FIELDS[shape].find(
        (key) => validation.errors[key],
      );
      const input = event.currentTarget.elements.namedItem(
        firstInvalid!,
      ) as HTMLInputElement;
      requestAnimationFrame(() => input.focus());
      return;
    }
    setErrors({});
    try {
      const nextResult = calculateVolume(validation.input);
      setResult(nextResult);
      setAnnouncement(
        `Estimated geometric volume: ${formatVolume(nextResult.cubicYards, "yd3")} cubic yards, ${formatVolume(nextResult.cubicFeet, "ft3")} cubic feet, ${formatVolume(nextResult.cubicMeters, "m3")} cubic meters.`,
      );
    } catch {
      const message =
        "These measurements are too large or too small to calculate reliably. Use values within a practical project range.";
      setFormError(message);
      setAnnouncement(message);
    }
  }

  function reset() {
    setFields(initialFields());
    setErrors({});
    setFormError("");
    setResult(null);
    setAnnouncement("Measurements, errors and results cleared.");
  }

  return (
    <div className="calculator-grid">
      <form
        className="calculator-panel"
        aria-labelledby="project-details-title"
        aria-describedby="calculator-scope"
        onSubmit={calculate}
        noValidate
      >
        <div className="panel-heading">
          <span className="tool-icon">
            <Icon name="ruler" />
          </span>
          <div>
            <h2 id="project-details-title">Your project details</h2>
            <p>Measure your space. Estimate its volume.</p>
          </div>
          <span className="status-badge">Volume calculator</span>
        </div>
        <fieldset>
          <legend>
            <span>01</span> Define your space
          </legend>
          <div className="field-pair">
            <div className="field">
              <label htmlFor="project-type">Project type</label>
              <select
                id="project-type"
                name="projectType"
                defaultValue="Driveway"
              >
                {[
                  "Driveway",
                  "Path",
                  "Patio Base",
                  "Garden Area",
                  "Custom",
                ].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="shape">Shape</label>
              <select
                id="shape"
                name="shape"
                value={shape}
                onChange={(event) =>
                  changeShape(event.target.value as ShapeType)
                }
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option disabled value="custom">
                  Custom — Coming Later
                </option>
              </select>
            </div>
          </div>
          <p className="field-help">
            Project type is for context only. It does not change the formula or
            set a recommended depth.
          </p>
        </fieldset>
        <fieldset>
          <legend>
            <span>02</span> Add your measurements
          </legend>
          <p className="field-help mb-5">
            Choose a unit for each dimension. Use a decimal point for fractions,
            such as 12.5. All measurements must be greater than 0.
          </p>
          <div
            className={`dimensions-grid ${shape === "circle" ? "dimensions-circle" : ""}`}
          >
            {SHAPE_FIELDS[shape].map((key) => (
              <div className="field" key={key}>
                <label htmlFor={key}>{labels[key]}</label>
                <input
                  id={key}
                  name={key}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={fields[key].value}
                  onChange={(event) =>
                    updateField(key, { value: event.target.value })
                  }
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                  required
                  placeholder={key === "depth" ? "e.g. 3" : "e.g. 10"}
                />
                {errors[key] && (
                  <p id={`${key}-error`} className="field-error">
                    {errors[key]}
                  </p>
                )}
                <label className="unit-label" htmlFor={`${key}-unit`}>
                  {labels[key]} unit
                </label>
                <select
                  id={`${key}-unit`}
                  name={`${key}Unit`}
                  value={fields[key].unit}
                  onChange={(event) =>
                    updateField(key, { unit: event.target.value as LengthUnit })
                  }
                >
                  {LENGTH_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="calculator-action">
          <div className="calculator-buttons">
            <Button type="submit">
              Calculate Gravel <Icon name="arrow" size={18} />
            </Button>
            <Button type="button" className="button-secondary" onClick={reset}>
              Reset
            </Button>
          </div>
          {formError && <p className="field-error">{formError}</p>}
          <p id="calculator-scope">
            Geometric volume only. Measurements are calculated in your browser
            and are not saved.
          </p>
        </div>
      </form>
      {result ? (
        <VolumeResults result={result} />
      ) : (
        <aside className="calculator-aside" aria-label="Planning notes">
          <p className="eyebrow">A GOOD PLACE TO START</p>
          <h2>
            Measure first.
            <br /> Order later.
          </h2>
          <p>A useful estimate starts with a clear picture of your space.</p>
          <ul>
            <li>Use length and width for a rectangle.</li>
            <li>For a circle, measure the diameter across its center.</li>
            <li>Enter the depth you intend to measure, using its own unit.</li>
          </ul>
          <div className="aside-note">
            <Icon name="plan" />
            <p>
              Choose a shape and enter your measurements to see volume in cubic
              yards, cubic feet and cubic meters.
            </p>
          </div>
        </aside>
      )}
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </p>
    </div>
  );
}
