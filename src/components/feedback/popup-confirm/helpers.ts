import { Color, Icons } from "../../../libs/infrastructure/types";
import { Status } from "../../../libs/core/application/contexts/Notification";
import { normalizeStatus } from "../notification/helpers";

export type PopupConfirmStatus = Status | "save" | "delete" | number;
export type PopupConfirmKind = Status | "save" | "delete";

export type PopupConfirmConfig = {
  kind: PopupConfirmKind;
  color: Color;
  icon: Icons;
  destructive: boolean;
};

const CONFIG: Record<PopupConfirmKind, PopupConfirmConfig> = {
  success: {
    kind: "success",
    color: "green",
    icon: "CheckCircle-Fill",
    destructive: false,
  },
  save: {
    kind: "save",
    color: "green",
    icon: "Floppy-Fill",
    destructive: false,
  },
  warning: {
    kind: "warning",
    color: "orange",
    icon: "Warning-Fill",
    destructive: false,
  },
  information: {
    kind: "information",
    color: "cyan",
    icon: "Information-Circle-Fill",
    destructive: false,
  },
  error: {
    kind: "error",
    color: "red",
    icon: "XCircle-Fill",
    destructive: true,
  },
  delete: {
    kind: "delete",
    color: "red",
    icon: "Trash-Fill",
    destructive: true,
  },
};

export const getPopupConfirmConfig = (
  status: PopupConfirmStatus,
): PopupConfirmConfig => {
  if (typeof status === "number") return CONFIG[normalizeStatus(status)];
  if (status in CONFIG) return CONFIG[status];
  return {
    kind: "information",
    color: "gray",
    icon: "Info",
    destructive: false,
  };
};
