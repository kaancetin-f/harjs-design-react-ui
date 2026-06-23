import { IChildrenProps, IStatusProps, IVariantProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IChildrenProps, IVariantProps<{ component: "card" }>, IStatusProps<{ component: "card" }> {
  title?: string;
  actions?: React.JSX.Element;
}

export default IProps;
