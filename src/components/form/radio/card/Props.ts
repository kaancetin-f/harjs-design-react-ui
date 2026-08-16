import RadioProps from "../IProps";
import { IBorderProps } from "../../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends Omit<RadioProps, "children" | "label" | "upperCase" | "trace" | "pastTrace">, IBorderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}

export default IProps;
