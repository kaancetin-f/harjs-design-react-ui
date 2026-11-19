import { ComponentProps } from "react";
import { Variants, Option, Status, Color, Sizes } from "../../../libs/infrastructure/types";

import Input from "../input";

export interface IMultiple {
  status?: {
    color?: Color;
    selected?: {
      variant?: Variants;
      color?: Color;
      size?: Sizes;
    };
  };
  value: Option[];
  onChange: (option: Option[]) => void;
  multiple: true;
  /** Seçilen değerleri chip yerine alan içinde adet olarak gösterir. Değerler `value` üzerinde kalır. */
  selectionCount?: boolean;
}

export interface ISingle {
  status?: Status;
  value: Option | undefined;
  onChange: (option: Option | undefined) => void;
  multiple?: false;
}

export type Props = {
  options: Option[];
  onSearch?: (searchText: string) => void;
  onClick?: () => void;
  onCreate?: (option: Option) => void;
  readOnly?: boolean;
  config?: {
    clear?: boolean;
    locale?: Intl.LocalesArgument;
    validation?: {
      text: "visible" | "hidden";
    };
  };
} & (IMultiple | ISingle) &
  Omit<ComponentProps<typeof Input>, "value" | "onChange">;
