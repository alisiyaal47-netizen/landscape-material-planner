import {
  formatMeasurement,
  formatVolume,
  type Measurement,
  type VolumeResult,
} from "@/lib/calculations/volume";
import { convertLength, type LengthUnit } from "@/lib/units/conversions";
import {
  formatPlanningDetail,
  formatPlanningNumber,
  type MaterialPlanResult,
} from "@/lib/calculations/material";

function ConvertedMeasurement({
  label,
  measurement,
  meters,
}: {
  label: string;
  measurement: Measurement;
  meters: number;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {formatMeasurement(measurement.value)} {measurement.unit} →{" "}
        {formatMeasurement(meters)} m
      </dd>
    </div>
  );
}

const EXISTING_UNIT_LABELS: Record<
  MaterialPlanResult["existingInputUnit"],
  string
> = { yd3: "yd³", ft3: "ft³", m3: "m³" };

export function VolumeResults({
  result,
  materialPlan,
  materialName,
}: {
  result: VolumeResult;
  materialPlan: MaterialPlanResult;
  materialName: string;
}) {
  const { input, meters } = result;
  const referenceUnit: LengthUnit =
    input.shape === "rectangle" ? input.length.unit : input.diameter.unit;
  const referenceLabel = referenceUnit;
  const depthInReferenceUnit = convertLength(
    input.depth.value,
    input.depth.unit,
    referenceUnit,
  );
  const originalMeasurements =
    input.shape === "rectangle"
      ? `${formatMeasurement(input.length.value)} ${input.length.unit} × ${formatMeasurement(input.width.value)} ${input.width.unit} × ${formatMeasurement(input.depth.value)} ${input.depth.unit}`
      : `Diameter ${formatMeasurement(input.diameter.value)} ${input.diameter.unit} × Depth ${formatMeasurement(input.depth.value)} ${input.depth.unit}`;
  return (
    <section className="volume-result" aria-labelledby="volume-result-title">
      <p className="eyebrow">YOUR PROJECT ESTIMATE</p>
      <h2 id="volume-result-title">Estimated Volume</h2>
      <p className="result-subtitle">Base geometric volume</p>
      <dl className="volume-metrics">
        <div className="volume-primary">
          <dt>Cubic yards</dt>
          <dd data-testid="cubic-yards">
            {formatVolume(result.cubicYards, "yd3")} <span>yd³</span>
          </dd>
        </div>
        <div>
          <dt>Cubic feet</dt>
          <dd data-testid="cubic-feet">
            {formatVolume(result.cubicFeet, "ft3")} <span>ft³</span>
          </dd>
        </div>
        <div>
          <dt>Cubic meters</dt>
          <dd data-testid="cubic-meters">
            {formatVolume(result.cubicMeters, "m3")} <span>m³</span>
          </dd>
        </div>
      </dl>
      <p className="result-note">
        This is a geometric volume estimate. The planning controls below apply
        an extra allowance and subtract existing material before estimating
        weight.
      </p>
      <div className="material-plan-summary">
        <h3>Material plan</h3>
        <dl className="plan-rows">
          <div>
            <dt>Base volume</dt>
            <dd>{formatPlanningNumber(materialPlan.baseCubicYards, 2)} yd³</dd>
          </div>
          <div>
            <dt>Extra allowance</dt>
            <dd>
              {formatPlanningNumber(materialPlan.allowancePercent, 2)}% (+
              {formatPlanningNumber(materialPlan.allowanceCubicYards, 2)} yd³)
            </dd>
          </div>
          <div>
            <dt>Planned volume</dt>
            <dd data-testid="planned-volume">
              {formatPlanningNumber(materialPlan.plannedCubicYards, 2)} yd³
            </dd>
          </div>
          <div>
            <dt>Existing material</dt>
            <dd data-testid="existing-volume">
              {formatPlanningNumber(materialPlan.existingInputQuantity, 2)}{" "}
              {EXISTING_UNIT_LABELS[materialPlan.existingInputUnit]}
              {materialPlan.existingInputUnit !== "yd3" && (
                <>
                  {" "}
                  ({formatPlanningNumber(materialPlan.existingCubicYards, 2)}
                  {" "}yd³)
                </>
              )}
            </dd>
          </div>
          <div className="plan-primary">
            <dt>Remaining material needed</dt>
            <dd data-testid="remaining-volume">
              {formatPlanningNumber(materialPlan.remainingCubicYards, 2)} yd³
            </dd>
          </div>
          <div>
            <dt>Material selected</dt>
            <dd>{materialName}</dd>
          </div>
          <div>
            <dt>Density used</dt>
            <dd>
              {formatPlanningNumber(
                materialPlan.densityShortTonsPerCubicYard,
                2,
              )}{" "}
              short tons / yd³
            </dd>
          </div>
        </dl>
      </div>
      <div className="weight-estimate">
        <h3>Estimated weight</h3>
        <dl className="weight-metrics">
          <div>
            <dt>Estimated US short tons</dt>
            <dd data-testid="short-tons">
              {formatPlanningNumber(materialPlan.shortTons, 2)}
            </dd>
          </div>
          <div>
            <dt>Estimated pounds</dt>
            <dd data-testid="pounds">
              {formatPlanningNumber(materialPlan.pounds, 2)} lb
            </dd>
          </div>
          <div>
            <dt>Estimated metric tonnes</dt>
            <dd data-testid="metric-tonnes">
              {formatPlanningNumber(materialPlan.metricTonnes, 3)} t
            </dd>
          </div>
        </dl>
        <p className="result-note">
          Actual delivered weight can vary with material size, moisture,
          gradation and supplier specifications.
        </p>
      </div>
      <div className="volume-breakdown">
        <h3>How this was calculated</h3>
        <dl className="measurement-breakdown calculation-summary">
          <div>
            <dt>Your measurements</dt>
            <dd>{originalMeasurements}</dd>
          </div>
          {input.depth.unit !== referenceUnit && (
            <div>
              <dt>Depth converted</dt>
              <dd>
                {formatMeasurement(input.depth.value)} {input.depth.unit} ={" "}
                {formatMeasurement(depthInReferenceUnit)} {referenceLabel}
              </dd>
            </div>
          )}
          {input.shape === "circle" && (
            <div>
              <dt>Radius = diameter ÷ 2</dt>
              <dd>
                {formatMeasurement(input.diameter.value)} {input.diameter.unit}{" "}
                ÷ 2 = {formatMeasurement(input.diameter.value / 2)}{" "}
                {referenceLabel}
              </dd>
            </div>
          )}
        </dl>
        <p>Measurements converted to meters:</p>
        <dl className="measurement-breakdown">
          {input.shape === "rectangle" && meters.shape === "rectangle" && (
            <>
              <ConvertedMeasurement
                label="Length"
                measurement={input.length}
                meters={meters.length}
              />
              <ConvertedMeasurement
                label="Width"
                measurement={input.width}
                meters={meters.width}
              />
            </>
          )}
          {input.shape === "circle" && meters.shape === "circle" && (
            <>
              <ConvertedMeasurement
                label="Diameter"
                measurement={input.diameter}
                meters={meters.diameter}
              />
              <div>
                <dt>Radius = diameter ÷ 2</dt>
                <dd>
                  {formatMeasurement(meters.diameter)} m ÷ 2 ≈{" "}
                  {formatMeasurement(meters.radius)} m
                </dd>
              </div>
            </>
          )}
          <ConvertedMeasurement
            label="Depth"
            measurement={input.depth}
            meters={meters.depth}
          />
        </dl>
        {meters.shape === "rectangle" ? (
          <>
            <p className="formula">Volume = Length × Width × Depth</p>
            <p className="formula-values">
              {formatMeasurement(meters.length)} ×{" "}
              {formatMeasurement(meters.width)} ×{" "}
              {formatMeasurement(meters.depth)} ≈{" "}
              {formatVolume(result.cubicMeters, "m3")} m³
            </p>
          </>
        ) : (
          <>
            <p className="formula">Volume = π × Radius² × Depth</p>
            <p className="formula-values">
              π × {formatMeasurement(meters.radius)}² ×{" "}
              {formatMeasurement(meters.depth)} ≈{" "}
              {formatVolume(result.cubicMeters, "m3")} m³
            </p>
          </>
        )}
        <p>
          1 yd³ = 27 ft³. Meter-based results are converted to cubic feet and
          cubic yards.
        </p>
        <p>
          Only the display is rounded: cubic feet and yards to 2 decimals, cubic
          meters to 3. Displayed measurement steps use up to 8 significant
          digits; calculations use the unrounded values.
        </p>
        <div className="material-breakdown">
          <h3>Material calculation</h3>
          <p>Planned volume = base volume × (1 + allowance ÷ 100)</p>
          <p className="formula-values">
            {formatPlanningDetail(materialPlan.baseCubicYards)} × (1 +{" "}
            {formatPlanningDetail(materialPlan.allowancePercent)} ÷ 100) ={" "}
            {formatPlanningDetail(materialPlan.plannedCubicYards)} yd³
          </p>
          <p>Remaining volume = max(0, planned volume − existing volume)</p>
          <p className="formula-values">
            max(0, {formatPlanningDetail(materialPlan.plannedCubicYards)} −{" "}
            {formatPlanningDetail(materialPlan.existingCubicYards)}) ={" "}
            {formatPlanningDetail(materialPlan.remainingCubicYards)} yd³
          </p>
          <p>Estimated short tons = remaining yd³ × density</p>
          <p className="formula-values">
            {formatPlanningDetail(materialPlan.remainingCubicYards)} ×{" "}
            {formatPlanningDetail(materialPlan.densityShortTonsPerCubicYard)} ={" "}
            {formatPlanningDetail(materialPlan.shortTons)} US short tons
          </p>
          <p>
            Pounds = short tons × 2,000. Metric tonnes = pounds × 0.45359237 ÷
            1,000.
          </p>
          <p>
            Preset densities are general planning values. Supplier density is
            more reliable for a specific material and delivery.
          </p>
        </div>
      </div>
    </section>
  );
}
