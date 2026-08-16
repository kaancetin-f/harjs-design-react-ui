"use client";

import { useCallback, useMemo } from "react";
import { Status, useNotificationContext } from "../contexts/Notification";
import {
  createNotificationId,
  PromiseToastOptions,
  resolveToastContent,
  ToastFields,
} from "../../../../components/feedback/notification/helpers";

export type ToastShowOptions = {
  title: string;
  message?: string;
  status?: Status | number;
  duration?: number;
};

export type ToastStatusOptions = {
  message?: string;
  duration?: number;
};

const toLoadingFields = (loading: string | ToastFields): ToastFields =>
  typeof loading === "string"
    ? { title: loading, status: "information", duration: 0 }
    : { status: "information", duration: 0, ...loading };

const useNotification = () => {
  const { dispatchToast, defaultDuration } = useNotificationContext();

  const show = useCallback(
    ({ title, message, status = "information", duration }: ToastShowOptions) => {
      const id = createNotificationId();
      dispatchToast({
        op: "push",
        id,
        title,
        message,
        status,
        duration: duration ?? defaultDuration,
        pending: false,
      });
      return id;
    },
    [defaultDuration, dispatchToast],
  );

  const success = useCallback(
    (title: string, options?: ToastStatusOptions) =>
      show({ title, ...options, status: "success" }),
    [show],
  );

  const error = useCallback(
    (title: string, options?: ToastStatusOptions) =>
      show({ title, ...options, status: "error" }),
    [show],
  );

  const warning = useCallback(
    (title: string, options?: ToastStatusOptions) =>
      show({ title, ...options, status: "warning" }),
    [show],
  );

  const information = useCallback(
    (title: string, options?: ToastStatusOptions) =>
      show({ title, ...options, status: "information" }),
    [show],
  );

  const promise = useCallback(
    <T,>(
      source: Promise<T> | (() => Promise<T>),
      options: PromiseToastOptions<T>,
    ) => {
      const pending = typeof source === "function" ? source() : source;
      const loading = toLoadingFields(options.loading);
      const id = createNotificationId();

      dispatchToast({
        op: "push",
        id,
        title: loading.title,
        message: loading.message,
        status: loading.status ?? "information",
        duration: loading.duration ?? 0,
        pending: true,
      });

      return pending
        .then((data) => {
          const next = resolveToastContent(options.success, data, "success");
          dispatchToast({
            op: "update",
            id,
            title: next.title,
            message: next.message,
            status: next.status ?? "success",
            duration: next.duration ?? defaultDuration,
            pending: false,
          });
          return data;
        })
        .catch((reason: unknown) => {
          const next = resolveToastContent(options.error, reason, "error");
          dispatchToast({
            op: "update",
            id,
            title: next.title,
            message: next.message,
            status: next.status ?? "error",
            duration: next.duration ?? defaultDuration,
            pending: false,
          });
          throw reason;
        });
    },
    [defaultDuration, dispatchToast],
  );

  return useMemo(
    () => ({ show, success, error, warning, information, promise }),
    [error, information, promise, show, success, warning],
  );
};

export default useNotification;
