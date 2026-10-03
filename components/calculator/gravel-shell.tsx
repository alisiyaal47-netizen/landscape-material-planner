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
import {
  calculateMaterialPlan,
  validateMaterialFields,
  type ExistingVolumeUnit,
  type MaterialFieldErrors,
  type MaterialFields,
  type MaterialPlanResult,
} from "@/lib/calculations/material";
import {
  DEFAULT_GRAVEL_DENSITY,
  DEFAULT_GRAVEL_MATERIAL_ID,
  GRAVEL_MATERIALS,
  getGravelMaterial,
  type GravelMaterialId,
} from "@/lib/materials/gravel";
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

const initialMaterialFields = (): MaterialFields => ({
  density: DEFAULT_GRAVEL_DENSITY.toFixed(2),
  allowance: "10",
  hasExisting: false,
  existingQuantity: "",
  existingUnit: "yd3",
});

type CalculatorResult = {
  volume: VolumeResult;
  material: MaterialPlanResult;
  materialName: string;
};

export function GravelShell() {
  const [shape, setShape] = useState<ShapeType>("rectangle");
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<MeasurementErrors>({});
  const [materialId, setMaterialId] = useState<GravelMaterialId>(
    DEFAULT_GRAVEL_MATERIAL_ID,
  );
  const [materialFields, setMaterialFields] = useState(initialMaterialFields);
  const [materialErrors, setMaterialErrors] = useState<MaterialFieldErrors>({});
  const [allowanceChoice, setAllowanceChoice] = useState("10");
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
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

  function updateMaterialField(
    change: Partial<MaterialFields>,
    clearError?: keyof MaterialFieldErrors,
  ) {
    setMaterialFields((current) => ({ ...current, ...change }));
    if (clearError) {
      setMaterialErrors((current) => ({
        ...current,
        [clearError]: undefined,
      }));
    }
    invalidate();
  }

  function changeMaterial(nextId: GravelMaterialId) {
    const material = getGravelMaterial(nextId);
    setMaterialId(nextId);
    updateMaterialField(
      { density: material.density === null ? "" : material.density.toFixed(2) },
      "density",
    );
  }

  function changeAllowance(nextChoice: string) {
    setAllowanceChoice(nextChoice);
    updateMaterialField(
      { allowance: nextChoice === "custom" ? "" : nextChoice },
      "allowance",
    );
  }

  function changeExisting(hasExisting: boolean) {
    updateMaterialField(
      {
        hasExisting,
        existingQuantity: hasExisting ? materialFields.existingQuantity : "",
      },
      "existingQuantity",
    );
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
    const volumeValidation = validateMeasurements(shape, fields);
    const materialValidation = validateMaterialFields(materialFields);
    setResult(null);
    setFormError("");
    setErrors(volumeValidation.valid ? {} : volumeValidation.errors);
    setMaterialErrors(
      materialValidation.valid ? {} : materialValidation.errors,
    );
    if (!volumeValidation.valid || !materialValidation.valid) {
      setAnnouncement(
        "Check the highlighted project and material fields before calculating.",
      );
      const firstVolumeError = !volumeValidation.valid
        ? SHAPE_FIELDS[shape].find((key) => volumeValidation.errors[key])
        : undefined;
      const firstMaterialError = !materialValidation.valid
        ? (["density", "allowance", "existingQuantity"] as const).find(
            (key) => materialValidation.errors[key],
          )
        : undefined;
      const fieldName =
        firstVolumeError ??
        (firstMaterialError === "allowance"
          ? "allowanceCustom"
          : firstMaterialError);
      const input = event.currentTarget.elements.namedItem(
        fieldName!,
      ) as HTMLInputElement | null;
      if (input) requestAnimationFrame(() => input.focus());
      return;
    }
    try {
      const volume = calculateVolume(volumeValidation.input);
      const material = calculateMaterialPlan({
        baseCubicYards: volume.cubicYards,
        ...materialValidation.value,
      });
      const materialName = getGravelMaterial(materialId).name;
      setResult({ volume, material, materialName });
      setAnnouncement(
        `Calculation complete. Base volume ${formatVolume(volume.cubicYards, "yd3")} cubic yards. Remaining material ${material.remainingCubicYards.toFixed(2)} cubic yards. Estimated weight ${material.shortTons.toFixed(2)} US short tons.`,
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
    setMaterialId(DEFAULT_GRAVEL_MATERIAL_ID);
    setMaterialFields(initialMaterialFields());
    setMaterialErrors({});
    setAllowanceChoice("10");
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
        <fieldset>
          <legend>
            <span>03</span> Choose your material
          </legend>
          <div className="field-pair">
            <div className="field">
              <label htmlFor="material">Gravel / material type</label>
              <select
                id="material"
                name="material"
                value={materialId}
                onChange={(event) =>
                  changeMaterial(event.target.value as GravelMaterialId)
                }
              >
                {GRAVEL_MATERIALS.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="density">Density (short tons / yd³)</label>
              <input
                id="density"
                name="density"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={materialFields.density}
                onChange={(event) =>
                  updateMaterialField(
                    { density: event.target.value },
                    "density",
                  )
                }
                aria-invalid={Boolean(materialErrors.density)}
                aria-describedby={
                  materialErrors.density
                    ? "density-error density-help"
                    : "density-help"
                }
                required
              />
              {materialErrors.density && (
                <p id="density-error" className="field-error">
                  {materialErrors.density}
                </p>
              )}
            </div>
          </div>
          <p id="density-help" className="field-help">
            Supplier density is more reliable than a general planning preset.
          </p>
        </fieldset>
        <fieldset>
          <legend>
            <span>04</span> Plan an extra allowance
          </legend>
          <div className="field-pair allowance-fields">
            <div className="field">
              <label htmlFor="allowance-choice">Extra Allowance</label>
              <select
                id="allowance-choice"
                name="allowanceChoice"
                value={allowanceChoice}
                onChange={(event) => changeAllowance(event.target.value)}
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {allowanceChoice === "custom" && (
              <div className="field">
                <label htmlFor="allowance-custom">
                  Custom extra allowance (%)
                </label>
                <input
                  id="allowance-custom"
                  name="allowanceCustom"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={materialFields.allowance}
                  onChange={(event) =>
                    updateMaterialField(
                      { allowance: event.target.value },
                      "allowance",
                    )
                  }
                  aria-invalid={Boolean(materialErrors.allowance)}
                  aria-describedby={
                    materialErrors.allowance ? "allowance-error" : undefined
                  }
                  required
                />
                {materialErrors.allowance && (
                  <p id="allowance-error" className="field-error">
                    {materialErrors.allowance}
                  </p>
                )}
              </div>
            )}
          </div>
          <p className="field-help">
            Adds a planning margin to geometric volume. It is not a compaction
            or waste recommendation.
          </p>
        </fieldset>
        <fieldset>
          <legend>
            <span>05</span> Account for existing material
          </legend>
          <div
            className="existing-choice"
            role="radiogroup"
            aria-labelledby="existing-question"
          >
            <p id="existing-question">Already have gravel?</p>
            <label className="radio-option">
              <input
                type="radio"
                name="hasExisting"
                value="no"
                checked={!materialFields.hasExisting}
                onChange={() => changeExisting(false)}
              />
              No
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="hasExisting"
                value="yes"
                checked={materialFields.hasExisting}
                onChange={() => changeExisting(true)}
              />
              Yes
            </label>
          </div>
          {materialFields.hasExisting && (
            <div className="field-pair existing-fields">
              <div className="field">
                <label htmlFor="existing-quantity">Existing quantity</label>
                <input
                  id="existing-quantity"
                  name="existingQuantity"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={materialFields.existingQuantity}
                  onChange={(event) =>
                    updateMaterialField(
                      { existingQuantity: event.target.value },
                      "existingQuantity",
                    )
                  }
                  aria-invalid={Boolean(materialErrors.existingQuantity)}
                  aria-describedby={
                    materialErrors.existingQuantity
                      ? "existing-quantity-error"
                      : undefined
                  }
                  required
                />
                {materialErrors.existingQuantity && (
                  <p id="existing-quantity-error" className="field-error">
                    {materialErrors.existingQuantity}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="existing-unit">Existing quantity unit</label>
                <select
                  id="existing-unit"
                  name="existingUnit"
                  value={materialFields.existingUnit}
                  onChange={(event) =>
                    updateMaterialField({
                      existingUnit: event.target.value as ExistingVolumeUnit,
                    })
                  }
                >
                  <option value="yd3">Cubic yards (yd³)</option>
                  <option value="ft3">Cubic feet (ft³)</option>
                  <option value="m3">Cubic meters (m³)</option>
                </select>
              </div>
            </div>
          )}
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
            Volume and material estimates are calculated in your browser and are
            not saved. No pricing or supplier data is included.
          </p>
        </div>
      </form>
      {result ? (
        <VolumeResults
          result={result.volume}
          materialPlan={result.material}
          materialName={result.materialName}
        />
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
              Choose a shape, material and planning allowance to see volume,
              remaining material and estimated weight.
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
