export const RARITY_ORDER = ["R", "SR", "SSR", "HR", "UR", "LSR", "SGR", "SC", "ZR"];

export const RARITY_LABELS = {
  R: "R (Rare)",
  SR: "SR (Silver Rare / Spark Rare)",
  SSR: "SSR (Super Spark Rare)",
  HR: "HR (Holo Rare)",
  UR: "UR (Ultra Rare)",
  LSR: "LSR (Limited Super Rare)",
  SGR: "SGR (Super Golden Rare)",
  SC: "SC (Secret Rare)",
  ZR: "ZR (Zenith Rare)"
};

export function normalizeRarity(rarity) {
  return (rarity || "").replace(/[^A-Za-z]/g, "").toUpperCase();
}
