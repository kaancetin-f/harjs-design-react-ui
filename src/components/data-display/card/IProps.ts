import { CardColors } from "../../../libs/infrastructure/types";
import {
  IBorderProps,
  IChildrenProps,
  IStatusProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

export type CardImagePosition = "top" | "overlay" | "start" | "end";

export type CardImage = {
  src: string;
  alt?: string;
  height?: string | number;
  width?: string | number;
  position?: CardImagePosition;
  fit?: "cover" | "contain";
};

interface IProps
  extends IChildrenProps, IVariantProps<{ component: "card" }>, IStatusProps<{ component: "card" }>, IBorderProps {
  title?: string;
  color?: CardColors;
  actions?: React.JSX.Element;
  image?: CardImage;
}

export default IProps;
