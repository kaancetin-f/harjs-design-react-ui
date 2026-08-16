import { Color } from "../../../libs/infrastructure/types";

const MIN = 0;
const MAX = 100;

export const normalizeProgressValue = (value: number): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return MIN;
  if (value <= MIN) return MIN;
  if (value >= MAX) return MAX;
  return value;
};

export const getProgressColor = (
  value: number,
  explicitColor?: Color,
  reverse = false,
): Color => {
  if (explicitColor) return explicitColor;

  const normalized = normalizeProgressValue(value);

  if (normalized <= 25) return reverse ? "green" : "red";
  if (normalized <= 50) return reverse ? "blue" : "orange";
  if (normalized <= 75) return reverse ? "orange" : "blue";
  return reverse ? "red" : "green";
};
