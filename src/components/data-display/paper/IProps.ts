import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps extends IChildrenProps {
  title?: string;
  action?: React.ReactNode;
}

export default IProps;
