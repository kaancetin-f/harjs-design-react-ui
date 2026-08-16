export type StepStatus = "pending" | "in-progress" | "completed";

export type StepClickAction = "ignore" | "commit" | "validate" | "blocked";

export type StepsOrientation = "horizontal" | "vertical";

const COLOR_TOKENS = new Set([
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "gray",
  "white",
]);

export const resolveStepsOrientation = (
  variant?: StepsOrientation,
  direction?: StepsOrientation,
): StepsOrientation => variant ?? direction ?? "horizontal";

export const resolveStepThemeColor = (value?: string) => {
  if (!value) return undefined;
  if (COLOR_TOKENS.has(value)) return `var(--${value}-500)`;
  return value;
};

export const getStepsThemeStyle = (theme?: {
  current?: string;
  completed?: string;
  pending?: string;
}): Record<string, string> => {
  const current = resolveStepThemeColor(theme?.current);
  const completed = resolveStepThemeColor(theme?.completed);
  const pending = resolveStepThemeColor(theme?.pending);
  const style: Record<string, string> = {};

  if (current) style["--steps-current"] = current;
  if (completed) style["--steps-completed"] = completed;
  if (pending) style["--steps-pending"] = pending;

  return style;
};

export const getStepStatus = (current: number, index: number): StepStatus => {
  if (current < index) return "pending";
  if (current === index) return "in-progress";
  return "completed";
};

export const clampStep = (step: number, count: number) => {
  if (count <= 0) return 0;
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(0, Math.trunc(step)), count - 1);
};

export const getStepsStorageKey = (name: string, pathname?: string) => {
  const path =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  return `${path}::${name}`;
};

export const parseStoredStep = (raw: string | null, count: number): number | null => {
  if (raw === null) return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return null;
  return clampStep(parsed, count);
};

export const getStepClickAction = (
  target: number,
  current: number,
  options: { isAutomatic?: boolean; hasValidation: boolean },
): StepClickAction => {
  if (options.isAutomatic) return "blocked";
  if (target === current) return "ignore";
  if (target < current) return "commit";
  if (!options.hasValidation) return "commit";
  if (target === current + 1) return "validate";
  return "blocked";
};
