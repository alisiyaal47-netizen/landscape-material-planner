import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PreviewForm } from "@/components/ui/preview-form";

const units = ["Feet", "Meters", "Inches", "Centimeters"];

export function GravelShell() {
  return (
    <div className="calculator-grid">
      <PreviewForm
        className="calculator-panel"
        aria-labelledby="project-details-title"
        aria-describedby="calculator-status"
      >
        <div className="panel-heading">
          <span className="tool-icon">
            <Icon name="ruler" />
          </span>
          <div>
            <h2 id="project-details-title">Your project details</h2>
            <p>Get familiar with the planning interface.</p>
          </div>
          <span className="status-badge">UI preview</span>
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
              <select id="shape" name="shape" defaultValue="Rectangle">
                {["Rectangle", "Circle", "Custom"].map((shape) => (
                  <option key={shape}>{shape}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="field-help">
            All shapes currently share this dimensions preview. Shape-specific
            inputs will be added with the calculation engine.
          </p>
        </fieldset>
        <fieldset>
          <legend>
            <span>02</span> Add your measurements
          </legend>
          <p className="field-help mb-5">
            You can explore the fields below. Values are not converted,
            calculated or saved.
          </p>
          <div className="dimensions-grid">
            {["Length", "Width", "Depth"].map((dimension) => (
              <div className="field" key={dimension}>
                <label htmlFor={dimension.toLowerCase()}>{dimension}</label>
                <input
                  id={dimension.toLowerCase()}
                  name={dimension.toLowerCase()}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder="e.g. 10"
                />
                <label
                  className="unit-label"
                  htmlFor={`${dimension.toLowerCase()}-unit`}
                >
                  {dimension} unit
                </label>
                <select
                  id={`${dimension.toLowerCase()}-unit`}
                  name={`${dimension.toLowerCase()}Unit`}
                  defaultValue={dimension === "Depth" ? "Inches" : "Feet"}
                >
                  {units.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="calculator-action">
          <Button type="button" disabled aria-describedby="calculator-status">
            Calculate Gravel <Icon name="arrow" size={18} />
          </Button>
          <p id="calculator-status">
            Calculator interface ready — calculation engine coming next. No
            results are generated in this preview.
          </p>
        </div>
      </PreviewForm>
      <aside className="calculator-aside" aria-label="Planning notes">
        <p className="eyebrow">A GOOD PLACE TO START</p>
        <h2>
          Measure first.
          <br /> Order later.
        </h2>
        <p>A useful estimate starts with a clear picture of your space.</p>
        <ul>
          <li>Sketch the area you want to cover.</li>
          <li>Record dimensions and their units.</li>
          <li>
            Check the planned depth with your supplier or project specification.
          </li>
        </ul>
        <div className="aside-note">
          <Icon name="plan" />
          <p>
            This preview does not provide material quantities or purchase
            recommendations.
          </p>
        </div>
      </aside>
    </div>
  );
}
