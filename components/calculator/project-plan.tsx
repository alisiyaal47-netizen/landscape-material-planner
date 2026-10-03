"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  formatPlanningDetail,
  formatPlanningNumber,
  type MaterialPlanResult,
} from "@/lib/calculations/material";
import { formatCurrency } from "@/lib/calculations/purchase";
import type { VolumeResult } from "@/lib/calculations/volume";
import {
  buildProjectPlanText,
  formatBagPurchaseQuantity,
  formatExistingMaterial,
  formatProjectMeasurements,
  getEnteredOptionStatement,
  type ProjectPlanPurchase,
  type ProjectPlanSnapshot,
} from "@/lib/project/plan";

export function ProjectPlan({
  projectType,
  volume,
  material,
  materialName,
  purchase,
}: {
  projectType: string;
  volume: VolumeResult;
  material: MaterialPlanResult;
  materialName: string;
  purchase?: ProjectPlanPurchase;
}) {
  const [copyFeedback, setCopyFeedback] = useState("");
  const snapshot: ProjectPlanSnapshot = useMemo(
    () => ({ projectType, volume, material, materialName, purchase }),
    [projectType, volume, material, materialName, purchase],
  );
  const copyText = useMemo(() => buildProjectPlanText(snapshot), [snapshot]);
  const existingCovers = material.remainingCubicYards === 0;

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyFeedback("Project plan copied.");
    } catch {
      setCopyFeedback(
        "The project plan could not be copied. Check browser clipboard permissions.",
      );
    }
  }

  return (
    <section className="project-plan" aria-labelledby="project-plan-title">
      <div className="project-plan-heading">
        <div>
          <p className="eyebrow">FINAL ENTERED-COST PLAN</p>
          <h2 id="project-plan-title">Your Gravel Project Plan</h2>
        </div>
        <div className="project-plan-actions" aria-label="Project plan actions">
          <Button type="button" className="button-secondary" onClick={copyPlan}>
            Copy Plan
          </Button>
          <Button
            type="button"
            className="button-secondary"
            onClick={() => window.print()}
          >
            Print Plan
          </Button>
        </div>
      </div>

      <div className="project-plan-sections">
        <section>
          <h3>Project</h3>
          <dl className="project-plan-rows">
            <div>
              <dt>Project type</dt>
              <dd>{projectType}</dd>
            </div>
            <div>
              <dt>Shape</dt>
              <dd>
                {volume.input.shape === "rectangle" ? "Rectangle" : "Circle"}
              </dd>
            </div>
            <div>
              <dt>Original measurements</dt>
              <dd>{formatProjectMeasurements(volume)}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h3>Material</h3>
          <dl className="project-plan-rows">
            <div>
              <dt>Selected gravel type</dt>
              <dd>{materialName}</dd>
            </div>
            <div>
              <dt>Density used</dt>
              <dd>
                {formatPlanningNumber(
                  material.densityShortTonsPerCubicYard,
                  2,
                )}{" "}
                short tons / yd³
              </dd>
            </div>
          </dl>
        </section>

        <section className="project-plan-quantity">
          <h3>Quantity</h3>
          <dl className="project-plan-rows">
            <div>
              <dt>Base volume</dt>
              <dd>
                {formatPlanningNumber(material.baseCubicYards, 2)} yd³
              </dd>
            </div>
            <div>
              <dt>Extra allowance</dt>
              <dd>
                {formatPlanningNumber(material.allowancePercent, 2)}%
              </dd>
            </div>
            <div>
              <dt>Planned volume</dt>
              <dd>
                {formatPlanningNumber(material.plannedCubicYards, 2)} yd³
              </dd>
            </div>
            <div>
              <dt>Existing material</dt>
              <dd>{formatExistingMaterial(material)}</dd>
            </div>
            <div className="project-plan-primary">
              <dt>Remaining material needed</dt>
              <dd data-testid="plan-remaining">
                {formatPlanningNumber(material.remainingCubicYards, 2)} yd³
              </dd>
            </div>
            <div>
              <dt>Estimated US short tons</dt>
              <dd>{formatPlanningNumber(material.shortTons, 2)}</dd>
            </div>
            <div>
              <dt>Pounds</dt>
              <dd>{formatPlanningNumber(material.pounds, 2)} lb</dd>
            </div>
            <div>
              <dt>Metric tonnes</dt>
              <dd>{formatPlanningNumber(material.metricTonnes, 3)} t</dd>
            </div>
          </dl>
        </section>

        {purchase && !existingCovers && (
          <>
            <section>
              <h3>Buying options — Bags</h3>
              <dl className="project-plan-rows">
                <div>
                  <dt>Purchase quantity</dt>
                  <dd data-testid="plan-bag-quantity">
                    {formatBagPurchaseQuantity(purchase)}
                  </dd>
                </div>
                <div>
                  <dt>Purchased volume</dt>
                  <dd>
                    {formatPlanningNumber(
                      purchase.bag.purchasedCubicYards,
                      2,
                    )}{" "}
                    yd³
                  </dd>
                </div>
                <div>
                  <dt>Estimated leftover</dt>
                  <dd>
                    {formatPlanningNumber(
                      purchase.bag.leftoverCubicYards,
                      2,
                    )}{" "}
                    yd³
                  </dd>
                </div>
                <div>
                  <dt>Total entered cost</dt>
                  <dd>{formatCurrency(purchase.bag.materialCost)}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3>Buying options — Bulk</h3>
              <dl className="project-plan-rows">
                <div>
                  <dt>Order volume</dt>
                  <dd data-testid="plan-bulk-quantity">
                    {formatPlanningDetail(purchase.bulk.orderCubicYards)}{" "}
                    cubic yards bulk
                  </dd>
                </div>
                <div>
                  <dt>Material cost</dt>
                  <dd>{formatCurrency(purchase.bulk.materialCost)}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd>{formatCurrency(purchase.bulk.deliveryFee)}</dd>
                </div>
                <div>
                  <dt>Estimated leftover</dt>
                  <dd>
                    {formatPlanningNumber(
                      purchase.bulk.leftoverCubicYards,
                      2,
                    )}{" "}
                    yd³
                  </dd>
                </div>
                <div>
                  <dt>Total entered cost</dt>
                  <dd>{formatCurrency(purchase.bulk.totalCost)}</dd>
                </div>
              </dl>
            </section>
          </>
        )}
      </div>

      {existingCovers ? (
        <div className="project-plan-coverage" role="note">
          <h3>Purchase needed: 0</h3>
          <p>
            Your entered existing material covers the estimated requirement.
          </p>
        </div>
      ) : (
        purchase && (
          <>
            <section className="project-plan-comparison">
              <h3>Final comparison</h3>
              <dl className="project-plan-rows">
                <div>
                  <dt>Lower entered-cost option</dt>
                  <dd data-testid="plan-lower-option">
                    {purchase.comparison.lowerCostOption === "equal"
                      ? "Costs are equal"
                      : purchase.comparison.lowerCostOption === "bags"
                        ? "Bags"
                        : "Bulk"}
                  </dd>
                </div>
                <div>
                  <dt>Cost difference</dt>
                  <dd>{formatCurrency(purchase.comparison.difference)}</dd>
                </div>
              </dl>
              <p>
                {purchase.comparison.lowerCostOption === "equal"
                  ? "Costs are equal based on entered values."
                  : "Lower-cost option based on the values you entered."}
              </p>
            </section>
            <section className="project-plan-recommendation">
              <h3>Recommended entered option</h3>
              <p data-testid="plan-recommendation">
                {getEnteredOptionStatement(purchase.comparison)}
              </p>
              {purchase.comparison.lowerCostOption === "equal" ? (
                <dl className="project-plan-rows">
                  <div>
                    <dt>Bag purchase quantity</dt>
                    <dd>{formatBagPurchaseQuantity(purchase)}</dd>
                  </div>
                  <div>
                    <dt>Bulk purchase quantity</dt>
                    <dd>
                      {formatPlanningNumber(
                        purchase.bulk.orderCubicYards,
                        2,
                      )}{" "}
                      cubic yards bulk
                    </dd>
                  </div>
                  <div>
                    <dt>Estimated totals</dt>
                    <dd>
                      Bags {formatCurrency(purchase.bag.materialCost)} / Bulk{" "}
                      {formatCurrency(purchase.bulk.totalCost)}
                    </dd>
                  </div>
                  <div>
                    <dt>Estimated leftovers</dt>
                    <dd>
                      Bags{" "}
                      {formatPlanningNumber(
                        purchase.bag.leftoverCubicYards,
                        2,
                      )}{" "}
                      yd³ / Bulk{" "}
                      {formatPlanningNumber(
                        purchase.bulk.leftoverCubicYards,
                        2,
                      )}{" "}
                      yd³
                    </dd>
                  </div>
                </dl>
              ) : (
                <dl className="project-plan-rows">
                  <div>
                    <dt>Purchase quantity</dt>
                    <dd data-testid="plan-purchase-quantity">
                      {purchase.comparison.lowerCostOption === "bags"
                        ? formatBagPurchaseQuantity(purchase)
                        : formatPlanningDetail(
                            purchase.bulk.orderCubicYards,
                          ) + " cubic yards bulk"}
                    </dd>
                  </div>
                  <div>
                    <dt>Estimated total</dt>
                    <dd data-testid="plan-estimated-total">
                      {formatCurrency(
                        purchase.comparison.lowerCostOption === "bags"
                          ? purchase.bag.materialCost
                          : purchase.bulk.totalCost,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Estimated leftover</dt>
                    <dd data-testid="plan-estimated-leftover">
                      {formatPlanningNumber(
                        purchase.comparison.lowerCostOption === "bags"
                          ? purchase.bag.leftoverCubicYards
                          : purchase.bulk.leftoverCubicYards,
                        2,
                      )}{" "}
                      yd³
                    </dd>
                  </div>
                </dl>
              )}
            </section>
          </>
        )
      )}

      <p className="project-plan-disclaimer">
        Planning estimates only. Verify measurements, product density,
        availability, prices, delivery terms and final order quantities with
        your supplier before purchasing.
      </p>
      <p className="copy-feedback" aria-live="polite" aria-atomic="true">
        {copyFeedback}
      </p>
    </section>
  );
}
