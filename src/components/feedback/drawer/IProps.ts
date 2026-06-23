import { TabProps, ValidationProps } from "../../../libs/infrastructure/types";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps<T extends object> extends IChildrenProps {
  title?: string;
  tabs: TabProps[];
  activeTab?: number;
  open: {
    get: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  validation?: {
    data: T;
    rules: ValidationProps<T>[];
  };
  onChange?: (currentTab: number) => void;
  onClose?: (closeTab: number) => void;
}

export default IProps;
