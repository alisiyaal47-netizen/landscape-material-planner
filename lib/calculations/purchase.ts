import { parseFiniteDecimal, SHORT_TON_POUNDS } from "./material";
import { CUBIC_FEET_PER_CUBIC_YARD } from "../units/conversions";

export type BagVolumeSource = "label-volume" | "weight-density";

export type BagOptionInput = {
  remainingCubicYards: number;
  densityShortTonsPerCubicYard: number;
  bagWeightPounds?: number;
  bagPrice: number;
  bagVolumeCubicFeet?: number;
};

export type BagOptionResult = {
  volumeSource: BagVolumeSource;
  bagVolumeCubicFeet: number;
  bagVolumeCubicYards: number;
  bagsNeeded: number;
  purchasedCubicYards: number;
  leftoverCubicYards: number;
  materialCost: number;
};

export type BulkOptionInput = {
  remainingCubicYards: number;
  pricePerCubicYard: number;
  minimumOrderCubicYards: number;
  orderIncrementCubicYards: number;
  deliveryFee: number;
};

export type BulkOptionResult = {
  requiredOrderCubicYards: number;
  orderCubicYards: number;
  leftoverCubicYards: number;
  materialCost: number;
  deliveryFee: number;
  totalCost: number;
};

export type PurchaseComparison = {
  lowerCostOption: "bags" | "bulk" | "equal";
  difference: number;
};

export type PurchaseFields = {
  bagWeight: string;
  bagPrice: string;
  bagVolume: string;
  bulkPrice: string;
  minimumOrder: string;
  orderIncrement: string;
  deliveryFee: string;
};

export type PurchaseFieldErrors = Partial<Record<keyof PurchaseFields, string>>;

export type ValidatedPurchaseFields = {
  bagWeightPounds?: number;
  bagPrice: number;
  bagVolumeCubicFeet?: number;
  pricePerCubicYard: number;
  minimumOrderCubicYards: number;
  orderIncrementCubicYards: number;
  deliveryFee: number;
};

function requireNonNegativeFinite(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite number of 0 or more.`);
  }
  return value;
}

function requirePositiveFinite(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a finite number greater than 0.`);
  }
  return value;
}

function optionalDecimal(raw: string): number | undefined | null {
  return raw.trim() === "" ? undefined : parseFiniteDecimal(raw);
}

export function validatePurchaseFields(fields: PurchaseFields):
  | { valid: true; value: ValidatedPurchaseFields }
  | { valid: false; errors: PurchaseFieldErrors } {
  const errors: PurchaseFieldErrors = {};
  const bagWeight = optionalDecimal(fields.bagWeight);
  const bagVolume = optionalDecimal(fields.bagVolume);
  const bagPrice = parseFiniteDecimal(fields.bagPrice);
  const bulkPrice = parseFiniteDecimal(fields.bulkPrice);
  const minimumOrder = parseFiniteDecimal(fields.minimumOrder);
  const orderIncrement = parseFiniteDecimal(fields.orderIncrement);
  const deliveryFee = parseFiniteDecimal(fields.deliveryFee);

  if (bagWeight !== undefined && (bagWeight === null || bagWeight <= 0)) {
    errors.bagWeight = "Enter a bag weight greater than 0, or leave it blank.";
  }
  if (bagVolume !== undefined && (bagVolume === null || bagVolume <= 0)) {
    errors.bagVolume =
      "Enter a bag label volume greater than 0, or leave it blank.";
  }
  if (bagWeight === undefined && bagVolume === undefined) {
    errors.bagWeight = "Enter a bag weight or a bag label volume.";
  }
  if (bagPrice === null || bagPrice < 0) {
    errors.bagPrice = "Enter a bag price of 0 or more using a finite number.";
  }
  if (bulkPrice === null || bulkPrice < 0) {
    errors.bulkPrice =
      "Enter a bulk price of 0 or more using a finite number.";
  }
  if (minimumOrder === null || minimumOrder < 0) {
    errors.minimumOrder =
      "Enter a minimum order of 0 or more using a finite number.";
  }
  if (orderIncrement === null || orderIncrement <= 0) {
    errors.orderIncrement =
      "Enter an order increment greater than 0 using a finite number.";
  }
  if (deliveryFee === null || deliveryFee < 0) {
    errors.deliveryFee =
      "Enter a delivery fee of 0 or more using a finite number.";
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    value: {
      bagWeightPounds: bagWeight ?? undefined,
      bagPrice: bagPrice!,
      bagVolumeCubicFeet: bagVolume ?? undefined,
      pricePerCubicYard: bulkPrice!,
      minimumOrderCubicYards: minimumOrder!,
      orderIncrementCubicYards: orderIncrement!,
      deliveryFee: deliveryFee!,
    },
  };
}

export function calculateBagOption(input: BagOptionInput): BagOptionResult {
  const remainingCubicYards = requireNonNegativeFinite(
    input.remainingCubicYards,
    "Remaining volume",
  );
  const density = requirePositiveFinite(
    input.densityShortTonsPerCubicYard,
    "Density",
  );
  const bagPrice = requireNonNegativeFinite(input.bagPrice, "Bag price");
  if (input.bagWeightPounds !== undefined) {
    requirePositiveFinite(input.bagWeightPounds, "Bag weight");
  }
  if (input.bagVolumeCubicFeet !== undefined) {
    requirePositiveFinite(input.bagVolumeCubicFeet, "Bag label volume");
  }
  if (
    input.bagWeightPounds === undefined &&
    input.bagVolumeCubicFeet === undefined
  ) {
    throw new RangeError("A bag weight or bag label volume is required.");
  }

  const volumeSource: BagVolumeSource =
    input.bagVolumeCubicFeet !== undefined
      ? "label-volume"
      : "weight-density";
  const bagVolumeCubicYards = requirePositiveFinite(
    input.bagVolumeCubicFeet !== undefined
      ? input.bagVolumeCubicFeet / CUBIC_FEET_PER_CUBIC_YARD
      : input.bagWeightPounds! / SHORT_TON_POUNDS / density,
    "Bag volume",
  );
  const bagVolumeCubicFeet = requirePositiveFinite(
    bagVolumeCubicYards * CUBIC_FEET_PER_CUBIC_YARD,
    "Bag volume",
  );
  const bagCountRatio = remainingCubicYards / bagVolumeCubicYards;
  if (!Number.isFinite(bagCountRatio)) {
    throw new RangeError("The bag count calculation overflowed.");
  }
  const nearestBagCount = Math.round(bagCountRatio);
  const bagCountTolerance =
    Number.EPSILON * Math.max(1, Math.abs(bagCountRatio)) * 8;
  const bagsNeeded = requireNonNegativeFinite(
    Math.abs(bagCountRatio - nearestBagCount) <= bagCountTolerance
      ? nearestBagCount
      : Math.ceil(bagCountRatio),
    "Bags needed",
  );
  if (!Number.isSafeInteger(bagsNeeded)) {
    throw new RangeError("The calculated bag count is too large.");
  }
  const purchasedCubicYards = requireNonNegativeFinite(
    bagsNeeded * bagVolumeCubicYards,
    "Bag purchased volume",
  );
  const leftoverCubicYards = requireNonNegativeFinite(
    Math.max(0, purchasedCubicYards - remainingCubicYards),
    "Bag leftover volume",
  );
  const materialCost = requireNonNegativeFinite(
    bagsNeeded * bagPrice,
    "Bag material cost",
  );

  return {
    volumeSource,
    bagVolumeCubicFeet,
    bagVolumeCubicYards,
    bagsNeeded,
    purchasedCubicYards,
    leftoverCubicYards,
    materialCost,
  };
}

export function roundUpToIncrement(value: number, increment: number): number {
  const validValue = requireNonNegativeFinite(value, "Order volume");
  const validIncrement = requirePositiveFinite(increment, "Order increment");
  const ratio = validValue / validIncrement;
  if (!Number.isFinite(ratio)) {
    throw new RangeError("The order increment calculation overflowed.");
  }
  const nearestInteger = Math.round(ratio);
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(ratio)) * 8;
  const incrementCount =
    Math.abs(ratio - nearestInteger) <= tolerance
      ? nearestInteger
      : Math.ceil(ratio);
  return requireNonNegativeFinite(
    incrementCount * validIncrement,
    "Rounded order volume",
  );
}

export function calculateBulkOption(input: BulkOptionInput): BulkOptionResult {
  const remainingCubicYards = requireNonNegativeFinite(
    input.remainingCubicYards,
    "Remaining volume",
  );
  const pricePerCubicYard = requireNonNegativeFinite(
    input.pricePerCubicYard,
    "Bulk price",
  );
  const minimumOrderCubicYards = requireNonNegativeFinite(
    input.minimumOrderCubicYards,
    "Minimum order",
  );
  const orderIncrementCubicYards = requirePositiveFinite(
    input.orderIncrementCubicYards,
    "Order increment",
  );
  const deliveryFee = requireNonNegativeFinite(
    input.deliveryFee,
    "Delivery fee",
  );
  const requiredOrderCubicYards = requireNonNegativeFinite(
    Math.max(remainingCubicYards, minimumOrderCubicYards),
    "Required order",
  );
  const orderCubicYards = roundUpToIncrement(
    requiredOrderCubicYards,
    orderIncrementCubicYards,
  );
  const materialCost = requireNonNegativeFinite(
    orderCubicYards * pricePerCubicYard,
    "Bulk material cost",
  );
  const totalCost = requireNonNegativeFinite(
    materialCost + deliveryFee,
    "Bulk total cost",
  );
  const leftoverCubicYards = requireNonNegativeFinite(
    Math.max(0, orderCubicYards - remainingCubicYards),
    "Bulk leftover volume",
  );

  return {
    requiredOrderCubicYards,
    orderCubicYards,
    leftoverCubicYards,
    materialCost,
    deliveryFee,
    totalCost,
  };
}

export function comparePurchaseOptions(
  bag: BagOptionResult,
  bulk: BulkOptionResult,
): PurchaseComparison {
  const bagCost = requireNonNegativeFinite(bag.materialCost, "Bag total cost");
  const bulkCost = requireNonNegativeFinite(bulk.totalCost, "Bulk total cost");
  const costsDisplayEqually =
    currencyComparisonDisplay(bagCost) === currencyComparisonDisplay(bulkCost);
  const difference = requireNonNegativeFinite(
    Math.abs(bagCost - bulkCost),
    "Cost difference",
  );
  return {
    lowerCostOption:
      costsDisplayEqually ? "equal" : bagCost < bulkCost ? "bags" : "bulk",
    difference,
  };
}

function currencyComparisonDisplay(value: number): string {
  return value < 0.005 ? "$0.00" : formatCurrency(value);
}

export function formatCurrency(value: number): string {
  requireNonNegativeFinite(value, "Displayed cost");
  if (value > 0 && value < 0.005) return "<$0.01";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
