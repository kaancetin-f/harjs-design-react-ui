import { ReactElement } from "react";
import IButtonProps from "../IProps";
import { Color, Icon, Variants } from "../../../../libs/infrastructure/types";

type ButtonItemProps = Pick<IButtonProps, "color" | "size" | "upperCase" | "icon">;

interface IProps extends ButtonItemProps {
  children: ReactElement<IButtonProps> | ReactElement<IButtonProps>[];
  title?: string;
  variant?: Variants;
  _color?: Color;
  _icon?: Icon;
}

export default IProps;
