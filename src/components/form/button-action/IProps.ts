import { ComponentProps, ReactElement } from "react";
import Button from "../button";
import { Color, Icon, Variants } from "../../../libs/infrastructure/types";

type ButtonProps = Pick<ComponentProps<typeof Button>, "color" | "size" | "upperCase" | "icon">;

interface IProps extends ButtonProps {
  children: ReactElement<typeof Button> | ReactElement<typeof Button>[];
  title?: string;
  variant?: Variants;
  _color?: Color;
  _icon?: Icon;
}

export default IProps;
