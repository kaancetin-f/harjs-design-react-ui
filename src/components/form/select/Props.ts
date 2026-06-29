import { ComponentProps } from "react";
import { Variants, Option, Status, Color } from "../../../libs/infrastructure/types";

import Input from "../input";

export interface IMultiple {
  status?: {
    color?: Color;
    selected?: {
      variant?: Variants;
      color?: Color;
    };
  };
  value: Option[];
  onChange: (option: Option[]) => void;
  multiple: true;
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
    validation?: {
      text: "visible" | "hidden";
    };
  };
} & (IMultiple | ISingle) &
  Omit<ComponentProps<typeof Input>, "value" | "onChange">;
