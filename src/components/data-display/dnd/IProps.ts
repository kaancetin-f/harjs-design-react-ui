import type { JSX } from "react";
import { Color } from "../../../libs/infrastructure/types";

export type Config = {
  /**
   * Show the grip control. Default `true`.
   */
  handle?: boolean;
  /**
   * Start a drag only from the grip. Default `true` when `handle` is on.
   */
  handleOnly?: boolean;
  /**
   * Accent for the placeholder, grip hover, and drop pulse. Default `blue`.
   */
  color?: Color;
};

interface IProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  itemKey?: (item: T, index: number) => string | number;
  onChange?: (data: T[]) => void;
  /**
   * Column id for cross-list moves (Kanban). Same-list reorder does not need it.
   */
  columnKey?: string;
  disabled?: boolean;
  config?: Config;
  /**
   * @deprecated Use `config`. `isMoveIcon` maps to `config.handle`.
   */
  confing?: { isMoveIcon?: boolean; isInTable?: boolean };
}

export default IProps;
