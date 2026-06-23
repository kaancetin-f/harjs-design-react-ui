import {
  IBorderProps,
  IChildrenProps,
  IColorProps,
  IIconProps,
  ISizeProps,
  IUpperCaseProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends
    IChildrenProps,
    IVariantProps,
    IColorProps,
    IBorderProps,
    IIconProps,
    ISizeProps,
    IUpperCaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  shape?: "circle" | "square";
  position?: {
    type: "fixed" | "absolute";
    inset: ("top" | "right" | "bottom" | "left")[];
  };
  fullWidth?: boolean;
}

export default IProps;
