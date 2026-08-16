import { ReactElement } from "react";
import IButtonProps from "../IProps";

type Props = {
  children: ReactElement<IButtonProps> | ReactElement<IButtonProps>[];
} & Omit<IButtonProps, "children">;

export default Props;
