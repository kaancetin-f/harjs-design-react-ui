import IButtonProps from "../IProps";

interface IProps extends Omit<IButtonProps, "shape" | "position"> {}

export default IProps;
