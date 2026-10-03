import {
  formatMeasurement,
  formatVolume,
  type Measurement,
  type VolumeResult,
} from "@/lib/calculations/volume";
import { convertLength, type LengthUnit } from "@/lib/units/conversions";

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

export function VolumeResults({ result }: { result: VolumeResult }) {
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
      <p className="result-subtitle">Estimated geometric volume</p>
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
        This is a geometric volume estimate. Material weight, compaction, waste
        and supplier quantities are not included yet.
      </p>
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
      </div>
    </section>
  );
}
