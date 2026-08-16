import CheckboxProps from "../Props";

interface IProps extends Omit<CheckboxProps, "children" | "label" | "upperCase"> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}

export default IProps;
