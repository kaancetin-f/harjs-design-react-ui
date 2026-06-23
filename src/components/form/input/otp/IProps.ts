import { IColorProps, IVariantProps } from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps
  extends IVariantProps, IColorProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "color"> {
  character: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default IProps;
