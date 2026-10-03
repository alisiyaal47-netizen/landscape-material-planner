export const GRAVEL_MATERIALS = [
  { id: "general-gravel", name: "General Gravel", density: 1.4 },
  { id: "pea-gravel", name: "Pea Gravel", density: 1.35 },
  { id: "crushed-stone-57", name: "Crushed Stone #57", density: 1.4 },
  { id: "crusher-run", name: "Crusher Run / Road Base", density: 1.45 },
  { id: "river-rock", name: "River Rock", density: 1.5 },
  { id: "decomposed-granite", name: "Decomposed Granite", density: 1.4 },
  { id: "crushed-limestone", name: "Crushed Limestone", density: 1.4 },
  { id: "lava-rock", name: "Lava Rock", density: 0.75 },
  { id: "custom", name: "Custom", density: null },
] as const;

export type GravelMaterialId = (typeof GRAVEL_MATERIALS)[number]["id"];
export type GravelMaterial = (typeof GRAVEL_MATERIALS)[number];

export const DEFAULT_GRAVEL_MATERIAL_ID: GravelMaterialId = "general-gravel";
export const DEFAULT_GRAVEL_DENSITY = 1.4;

export function getGravelMaterial(id: GravelMaterialId): GravelMaterial {
  const material = GRAVEL_MATERIALS.find((candidate) => candidate.id === id);
  if (!material) throw new RangeError(`Unsupported gravel material: ${id}`);
  return material;
}
