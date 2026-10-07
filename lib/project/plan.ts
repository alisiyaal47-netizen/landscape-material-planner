import {
  formatPlanningDetail,
  formatPlanningNumber,
  type MaterialPlanResult,
} from "../calculations/material";
import {
  formatMeasurement,
  type VolumeResult,
} from "../calculations/volume";
import {
  formatCurrency,
  type BagOptionResult,
  type BulkOptionResult,
  type PurchaseComparison,
  type ValidatedPurchaseFields,
} from "../calculations/purchase";

export type ProjectPlanPurchase = {
  bag: BagOptionResult;
  bulk: BulkOptionResult;
  comparison: PurchaseComparison;
  inputs: ValidatedPurchaseFields;
};

export type ProjectPlanSnapshot = {
  projectType: string;
  volume: VolumeResult;
  material: MaterialPlanResult;
  materialName: string;
  purchase?: ProjectPlanPurchase;
};

const EXISTING_UNIT_LABELS: Record<
  MaterialPlanResult["existingInputUnit"],
  string
> = { yd3: "yd³", ft3: "ft³", m3: "m³" };

export function formatProjectMeasurements(volume: VolumeResult): string {
  const input = volume.input;
  if (input.shape === "rectangle") {
    return (
      formatMeasurement(input.length.value) +
      " " +
      input.length.unit +
      " × " +
      formatMeasurement(input.width.value) +
      " " +
      input.width.unit +
      " × " +
      formatMeasurement(input.depth.value) +
      " " +
      input.depth.unit
    );
  }
  return (
    "Diameter " +
    formatMeasurement(input.diameter.value) +
    " " +
    input.diameter.unit +
    " × Depth " +
    formatMeasurement(input.depth.value) +
    " " +
    input.depth.unit
  );
}

export function formatExistingMaterial(material: MaterialPlanResult): string {
  const input =
    formatPlanningNumber(material.existingInputQuantity, 2) +
    " " +
    EXISTING_UNIT_LABELS[material.existingInputUnit];
  return material.existingInputUnit === "yd3"
    ? input
    : input +
        " (" +
        formatPlanningNumber(material.existingCubicYards, 2) +
        " yd³)";
}

export function formatBagPurchaseQuantity(
  purchase: ProjectPlanPurchase,
): string {
  const count = purchase.bag.bagsNeeded.toLocaleString("en-US");
  if (purchase.inputs.bagWeightPounds !== undefined) {
    return (
      count +
      " × " +
      formatPlanningDetail(purchase.inputs.bagWeightPounds) +
      " lb bags"
    );
  }
  return (
    count +
    " × " +
    formatPlanningDetail(purchase.inputs.bagVolumeCubicFeet!) +
    " ft³ bags"
  );
}

export function getEnteredOptionStatement(
  comparison: PurchaseComparison,
): string {
  if (comparison.lowerCostOption === "bags") {
    return "Based on your entered values, bags have the lower estimated cost.";
  }
  if (comparison.lowerCostOption === "bulk") {
    return "Based on your entered values, bulk has the lower estimated cost.";
  }
  return "Both options have the same estimated entered cost.";
}

export function buildProjectPlanText(snapshot: ProjectPlanSnapshot): string {
  const { material, purchase, volume } = snapshot;
  const lines = [
    "Gravel Project Plan",
    "Project: " + snapshot.projectType,
    "Shape: " +
      (volume.input.shape === "rectangle" ? "Rectangle" : "Circle"),
    "Measurements: " + formatProjectMeasurements(volume),
    "Material: " + snapshot.materialName,
    "Density: " +
      formatPlanningNumber(material.densityShortTonsPerCubicYard, 2) +
      " short tons/yd³",
    "",
    "Quantity",
    "Base volume: " +
      formatPlanningNumber(material.baseCubicYards, 2) +
      " yd³",
    "Extra allowance: " +
      formatPlanningNumber(material.allowancePercent, 2) +
      "%",
    "Planned volume: " +
      formatPlanningNumber(material.plannedCubicYards, 2) +
      " yd³",
    "Existing material: " + formatExistingMaterial(material),
    "Remaining: " +
      formatPlanningNumber(material.remainingCubicYards, 2) +
      " yd³",
    "Estimated weight: " +
      formatPlanningNumber(material.shortTons, 2) +
      " US short tons",
    "Pounds: " + formatPlanningNumber(material.pounds, 2) + " lb",
    "Metric tonnes: " +
      formatPlanningNumber(material.metricTonnes, 3) +
      " t",
  ];

  if (!purchase) {
    lines.push(
      "",
      "Purchase needed: 0",
      "Your entered existing material covers the estimated requirement.",
    );
  } else {
    const lower =
      purchase.comparison.lowerCostOption === "equal"
        ? "Equal"
        : purchase.comparison.lowerCostOption === "bags"
          ? "Bags"
          : "Bulk";
    lines.push(
      "",
      "Bags:",
      formatBagPurchaseQuantity(purchase),
      "Purchased volume: " +
        formatPlanningNumber(purchase.bag.purchasedCubicYards, 2) +
        " yd³",
      "Leftover: " +
        formatPlanningNumber(purchase.bag.leftoverCubicYards, 2) +
        " yd³",
      "Estimated cost: " + formatCurrency(purchase.bag.materialCost),
      "",
      "Bulk:",
      formatPlanningDetail(purchase.bulk.orderCubicYards) +
        " yd³ bulk",
      "Material cost: " + formatCurrency(purchase.bulk.materialCost),
      "Delivery: " + formatCurrency(purchase.bulk.deliveryFee),
      "Leftover: " +
        formatPlanningNumber(purchase.bulk.leftoverCubicYards, 2) +
        " yd³",
      "Estimated total: " + formatCurrency(purchase.bulk.totalCost),
      "",
      "Lower entered cost: " + lower,
      "Difference: " + formatCurrency(purchase.comparison.difference),
      getEnteredOptionStatement(purchase.comparison),
      purchase.comparison.lowerCostOption === "equal"
        ? "Costs are equal to the nearest cent based on entered values."
        : "Lower-cost option based on the values you entered.",
    );
  }

  lines.push(
    "",
    "Planning estimates only. Verify measurements, product density, availability, prices, delivery terms and final order quantities with your supplier before purchasing.",
  );
  return lines.join("\n");
}
