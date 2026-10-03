"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  calculateBagOption,
  calculateBulkOption,
  comparePurchaseOptions,
  formatCurrency,
  validatePurchaseFields,
  type BagOptionResult,
  type BulkOptionResult,
  type PurchaseComparison,
  type PurchaseFieldErrors,
  type PurchaseFields,
  type ValidatedPurchaseFields,
} from "@/lib/calculations/purchase";
import {
  formatPlanningDetail,
  formatPlanningNumber,
  type MaterialPlanResult,
} from "@/lib/calculations/material";
import type { VolumeResult } from "@/lib/calculations/volume";
import { ProjectPlan } from "./project-plan";

const initialPurchaseFields = (): PurchaseFields => ({
  bagWeight: "",
  bagPrice: "",
  bagVolume: "",
  bulkPrice: "",
  minimumOrder: "",
  orderIncrement: "",
  deliveryFee: "",
});

type PurchaseResult = {
  bag: BagOptionResult;
  bulk: BulkOptionResult;
  comparison: PurchaseComparison;
  inputs: ValidatedPurchaseFields;
};

const purchaseLabels: Record<keyof PurchaseFields, string> = {
  bagWeight: "Bag weight (lb)",
  bagPrice: "Bag price ($)",
  bagVolume: "Bag label volume (ft³), optional",
  bulkPrice: "Price per cubic yard ($)",
  minimumOrder: "Minimum order (yd³)",
  orderIncrement: "Order increment (yd³)",
  deliveryFee: "Delivery fee ($)",
};

export function PurchasePlanner({
  projectType,
  volume,
  material,
  materialName,
}: {
  projectType: string;
  volume: VolumeResult;
  material: MaterialPlanResult;
  materialName: string;
}) {
  const remainingCubicYards = material.remainingCubicYards;
  const densityShortTonsPerCubicYard =
    material.densityShortTonsPerCubicYard;
  const [fields, setFields] = useState(initialPurchaseFields);
  const [errors, setErrors] = useState<PurchaseFieldErrors>({});
  const [result, setResult] = useState<PurchaseResult | null>(null);
  const [formError, setFormError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  function updateField(key: keyof PurchaseFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (result) {
      setAnnouncement(
        "Buying values changed. Compare again for updated purchase options.",
      );
    }
    setResult(null);
    setFormError("");
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validatePurchaseFields(fields);
    setResult(null);
    setFormError("");
    if (!validation.valid) {
      setErrors(validation.errors);
      setAnnouncement("Check the highlighted bag and bulk buying fields.");
      const firstError = (
        [
          "bagWeight",
          "bagVolume",
          "bagPrice",
          "bulkPrice",
          "minimumOrder",
          "orderIncrement",
          "deliveryFee",
        ] as const
      ).find((key) => validation.errors[key]);
      const input = event.currentTarget.elements.namedItem(
        firstError!,
      ) as HTMLInputElement | null;
      if (input) requestAnimationFrame(() => input.focus());
      return;
    }
    setErrors({});
    try {
      const bag = calculateBagOption({
        remainingCubicYards,
        densityShortTonsPerCubicYard,
        bagWeightPounds: validation.value.bagWeightPounds,
        bagPrice: validation.value.bagPrice,
        bagVolumeCubicFeet: validation.value.bagVolumeCubicFeet,
      });
      const bulk = calculateBulkOption({
        remainingCubicYards,
        pricePerCubicYard: validation.value.pricePerCubicYard,
        minimumOrderCubicYards: validation.value.minimumOrderCubicYards,
        orderIncrementCubicYards:
          validation.value.orderIncrementCubicYards,
        deliveryFee: validation.value.deliveryFee,
      });
      const comparison = comparePurchaseOptions(bag, bulk);
      setResult({ bag, bulk, comparison, inputs: validation.value });
      setAnnouncement(
        comparison.lowerCostOption === "equal"
          ? "Purchase comparison complete. Costs are equal based on entered values."
          : "Purchase comparison complete. " +
              (comparison.lowerCostOption === "bags" ? "Bags" : "Bulk") +
              " has the lower entered cost by " +
              formatCurrency(comparison.difference) +
              ".",
      );
    } catch {
      const message =
        "These buying values produce a result outside the supported numerical range.";
      setFormError(message);
      setAnnouncement(message);
    }
  }

  function reset() {
    setFields(initialPurchaseFields());
    setErrors({});
    setResult(null);
    setFormError("");
    setAnnouncement("Buying values, errors and comparison cleared.");
  }

  return (
    <section
      className="purchase-planner"
      aria-labelledby="purchase-planner-title"
    >
      <div className="purchase-heading">
        <div>
          <p className="eyebrow">06 / BUYING PLANNER</p>
          <h2 id="purchase-planner-title">Compare Buying Options</h2>
          {remainingCubicYards === 0 ? (
            <p>
              No buying comparison is needed because the remaining material
              estimate is 0.00 yd³.
            </p>
          ) : (
            <p>
              Enter bag and bulk prices you found. The comparison uses the{" "}
              {formatPlanningNumber(remainingCubicYards, 2)} yd³ remaining
              material estimate above.
            </p>
          )}
        </div>
        <span className="status-badge">
          {remainingCubicYards === 0
            ? "Existing material covers need"
            : "Your entered prices"}
        </span>
      </div>
      {remainingCubicYards > 0 && (
        <form onSubmit={calculate} noValidate>
        <div className="purchase-option-grid">
          <fieldset className="purchase-option-card">
            <legend>Bags</legend>
            <p className="field-help">
              Enter a label volume when available. Otherwise, enter bag weight
              and the calculator will estimate volume from the selected density.
            </p>
            <div className="purchase-fields">
              {(["bagWeight", "bagPrice", "bagVolume"] as const).map((key) => (
                <div className="field" key={key}>
                  <label htmlFor={key}>{purchaseLabels[key]}</label>
                  <input
                    id={key}
                    name={key}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={fields[key]}
                    onChange={(event) => updateField(key, event.target.value)}
                    aria-invalid={Boolean(errors[key])}
                    aria-describedby={errors[key] ? key + "-error" : undefined}
                    placeholder={
                      key === "bagWeight"
                        ? "e.g. 50"
                        : key === "bagPrice"
                          ? "e.g. 5.99"
                          : "e.g. 0.5"
                    }
                  />
                  {errors[key] && (
                    <p id={key + "-error"} className="field-error">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="purchase-note">
              Weight-based bag volume is density-dependent. A valid label volume
              takes priority when both are entered.
            </p>
          </fieldset>
          <fieldset className="purchase-option-card">
            <legend>Bulk</legend>
            <p className="field-help">
              Enter the supplier&apos;s cubic-yard price, order rules and delivery
              fee.
            </p>
            <div className="purchase-fields purchase-fields-bulk">
              {(
                [
                  "bulkPrice",
                  "minimumOrder",
                  "orderIncrement",
                  "deliveryFee",
                ] as const
              ).map((key) => (
                <div className="field" key={key}>
                  <label htmlFor={key}>{purchaseLabels[key]}</label>
                  <input
                    id={key}
                    name={key}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={fields[key]}
                    onChange={(event) => updateField(key, event.target.value)}
                    aria-invalid={Boolean(errors[key])}
                    aria-describedby={errors[key] ? key + "-error" : undefined}
                    placeholder={
                      key === "bulkPrice"
                        ? "e.g. 52"
                        : key === "minimumOrder"
                          ? "e.g. 1"
                          : key === "orderIncrement"
                            ? "e.g. 0.5"
                            : "e.g. 75"
                    }
                  />
                  {errors[key] && (
                    <p id={key + "-error"} className="field-error">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="purchase-actions">
          <Button type="submit">
            Compare options <Icon name="arrow" size={18} />
          </Button>
          <Button type="button" className="button-secondary" onClick={reset}>
            Reset buying options
          </Button>
        </div>
        {formError && <p className="field-error">{formError}</p>}
        </form>
      )}
      {remainingCubicYards === 0 && (
        <>
          <div className="purchase-covered" role="note">
            <strong>Purchase needed: 0</strong>
            <p>
              Your entered existing material covers the estimated requirement.
            </p>
          </div>
          <ProjectPlan
            projectType={projectType}
            volume={volume}
            material={material}
            materialName={materialName}
          />
        </>
      )}
      {remainingCubicYards > 0 && result && (
        <>
          <PurchaseResults
            bag={result.bag}
            bulk={result.bulk}
            comparison={result.comparison}
            remainingCubicYards={remainingCubicYards}
            densityShortTonsPerCubicYard={densityShortTonsPerCubicYard}
          />
          <ProjectPlan
            projectType={projectType}
            volume={volume}
            material={material}
            materialName={materialName}
            purchase={{
              bag: result.bag,
              bulk: result.bulk,
              comparison: result.comparison,
              inputs: result.inputs,
            }}
          />
        </>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}

function PurchaseResults({
  bag,
  bulk,
  comparison,
  remainingCubicYards,
  densityShortTonsPerCubicYard,
}: {
  bag: BagOptionResult;
  bulk: BulkOptionResult;
  comparison: PurchaseComparison;
  remainingCubicYards: number;
  densityShortTonsPerCubicYard: number;
}) {
  const bagLower = comparison.lowerCostOption === "bags";
  const bulkLower = comparison.lowerCostOption === "bulk";
  return (
    <section
      className="purchase-comparison"
      aria-labelledby="purchase-comparison-title"
    >
      <div className="comparison-heading">
        <div>
          <p className="eyebrow">ENTERED COST COMPARISON</p>
          <h2 id="purchase-comparison-title">Purchase Comparison</h2>
        </div>
        <div className="comparison-difference">
          <span>Difference</span>
          <strong data-testid="cost-difference">
            {formatCurrency(comparison.difference)}
          </strong>
        </div>
      </div>
      <div className="comparison-cards">
        <article
          className={"comparison-card" + (bagLower ? " is-lower" : "")}
        >
          <div className="comparison-card-title">
            <h3>Bags</h3>
            {bagLower && <span>Lower entered cost</span>}
          </div>
          <dl className="comparison-rows">
            <div>
              <dt>Bags needed</dt>
              <dd data-testid="bags-needed">{bag.bagsNeeded}</dd>
            </div>
            <div>
              <dt>Bag total cost</dt>
              <dd data-testid="bag-total">{formatCurrency(bag.materialCost)}</dd>
            </div>
            <div>
              <dt>Purchased volume</dt>
              <dd>{formatPlanningNumber(bag.purchasedCubicYards, 2)} yd³</dd>
            </div>
            <div>
              <dt>Estimated leftover</dt>
              <dd data-testid="bag-leftover">
                {formatPlanningNumber(bag.leftoverCubicYards, 2)} yd³
              </dd>
            </div>
          </dl>
          <p className="comparison-detail" data-testid="bag-volume-method">
            {bag.volumeSource === "label-volume"
              ? "Uses the entered " +
                formatPlanningDetail(bag.bagVolumeCubicFeet) +
                " ft³ label volume per bag."
              : "Estimated from bag weight and " +
                formatPlanningDetail(densityShortTonsPerCubicYard) +
                " short tons/yd³ density: " +
                formatPlanningDetail(bag.bagVolumeCubicYards) +
                " yd³ per bag."}
          </p>
          {bag.volumeSource === "weight-density" && (
            <p className="comparison-detail">
              Weight-based bag volume is density-dependent.
            </p>
          )}
        </article>
        <article
          className={"comparison-card" + (bulkLower ? " is-lower" : "")}
        >
          <div className="comparison-card-title">
            <h3>Bulk</h3>
            {bulkLower && <span>Lower entered cost</span>}
          </div>
          <dl className="comparison-rows">
            <div>
              <dt>Bulk order quantity</dt>
              <dd data-testid="bulk-order">
                {formatPlanningNumber(bulk.orderCubicYards, 2)} yd³
              </dd>
            </div>
            <div>
              <dt>Bulk material cost</dt>
              <dd data-testid="bulk-material-cost">
                {formatCurrency(bulk.materialCost)}
              </dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd data-testid="bulk-delivery">
                {formatCurrency(bulk.deliveryFee)}
              </dd>
            </div>
            <div>
              <dt>Bulk total cost</dt>
              <dd data-testid="bulk-total">{formatCurrency(bulk.totalCost)}</dd>
            </div>
            <div>
              <dt>Estimated leftover</dt>
              <dd data-testid="bulk-leftover">
                {formatPlanningNumber(bulk.leftoverCubicYards, 2)} yd³
              </dd>
            </div>
          </dl>
          <p className="comparison-detail">
            The {formatPlanningNumber(remainingCubicYards, 2)} yd³ requirement is
            raised to the minimum when needed, then rounded up to the entered
            supplier increment.
          </p>
        </article>
      </div>
      <div className="comparison-summary" role="note">
        {comparison.lowerCostOption === "equal" ? (
          <p>Costs are equal based on entered values.</p>
        ) : (
          <>
            <p>
              <strong>{bagLower ? "Bags" : "Bulk"}</strong> is lower by{" "}
              {formatCurrency(comparison.difference)}.
            </p>
            <p>Lower-cost option based on the values you entered.</p>
          </>
        )}
      </div>
    </section>
  );
}
