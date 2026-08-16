import React from "react";
import {
  IBorderProps,
  IColorProps,
  IFontWeightProps,
  IIconProps,
  ISizeProps,
  IUpperCaseProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

export type ChipImagePosition = "start" | "end";

export type ChipImage = {
  src: string;
  alt?: string;
  position?: ChipImagePosition;
  fit?: "cover" | "contain";
};

interface IProps
  extends IVariantProps, IColorProps, IBorderProps, IIconProps, ISizeProps, IUpperCaseProps, IFontWeightProps {
  text: string;
  customColor?: string;
  image?: ChipImage | ChipImage[];
  /**
   * When provided, renders a delete (×) control on the chip.
   * Clicking it calls this handler and does not bubble to parent click handlers.
   */
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default IProps;
