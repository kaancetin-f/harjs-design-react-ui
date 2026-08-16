"use client";

import { useCallback, useMemo } from "react";
import {
  ConfirmAskPayload,
  PopupButtonConfig,
  useNotificationContext,
} from "../contexts/Notification";

export type ConfirmAskOptions = ConfirmAskPayload & {
  confirmText?: string;
  cancelText?: string;
};

const useConfirm = () => {
  const { askConfirm, closeConfirm } = useNotificationContext();

  const ask = useCallback(
    ({ confirmText, cancelText, buttons, ...payload }: ConfirmAskOptions) => {
      const nextButtons: PopupButtonConfig = {
        okay: {
          ...buttons?.okay,
          ...(confirmText ? { children: confirmText } : {}),
        },
        cancel: {
          ...buttons?.cancel,
          ...(cancelText ? { children: cancelText } : {}),
        },
      };

      return askConfirm({ ...payload, buttons: nextButtons });
    },
    [askConfirm],
  );

  return useMemo(() => ({ ask, close: closeConfirm }), [ask, closeConfirm]);
};

export default useConfirm;
