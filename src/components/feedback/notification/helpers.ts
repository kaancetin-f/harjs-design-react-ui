import { Status } from "../../../libs/core/application/contexts/Notification";

const SEMANTIC_STATUSES: readonly Status[] = [
  "success",
  "warning",
  "information",
  "error",
];

export type ToastFields = {
  title: string;
  message?: string;
  status?: Status | number;
  duration?: number;
};

export type ToastContentInput<T> =
  string | ToastFields | ((value: T) => string | ToastFields);

export type PromiseToastOptions<T> = {
  loading: string | ToastFields;
  success: ToastContentInput<T>;
  error: ToastContentInput<unknown>;
};

export const resolveToastContent = <T>(
  input: ToastContentInput<T>,
  value: T,
  fallbackStatus: Status,
): ToastFields => {
  const resolved = typeof input === "function" ? input(value) : input;
  if (typeof resolved === "string")
    return { title: resolved, status: fallbackStatus };
  return { status: fallbackStatus, ...resolved };
};

export const normalizeStatus = (status: Status | number): Status => {
  if (typeof status === "number") {
    if (status >= 100 && status < 200) return "information";
    if (status >= 200 && status < 300) return "success";
    if (status >= 300 && status < 400) return "warning";
    if (status >= 400 && status < 600) return "error";
    return "information";
  }

  if ((SEMANTIC_STATUSES as readonly string[]).includes(status)) return status;

  return "information";
};

let fallbackCount = 0;

export const createNotificationId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  fallbackCount += 1;
  return `har-notification-${Date.now()}-${fallbackCount}`;
};
