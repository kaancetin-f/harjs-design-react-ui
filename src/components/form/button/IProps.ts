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
  /**
   * Horizontal alignment of the icon + label inside the button.
   * `icon.position` still controls which side of the text the icon sits on.
   * The difference is visible on `fullWidth` or any stretched control.
   * @default "center"
   */
  align?: "left" | "center" | "right";
  fullWidth?: boolean;
  loading?: boolean;
  spinner?: React.ReactNode;
}

export default IProps;
