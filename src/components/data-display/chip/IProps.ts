import { IBorderProps, IColorProps, IIconProps, IVariantProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IVariantProps, IColorProps, IBorderProps, IIconProps {
  text: string;
  customColor?: string;
}

export default IProps;
