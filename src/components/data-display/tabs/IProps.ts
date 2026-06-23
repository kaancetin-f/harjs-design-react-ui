import { TabProps } from "../../../libs/infrastructure/types";

interface IProps {
  name: string;
  tabs: TabProps[];
  activeTab?: number;
  onChange?: (currentTab: number) => void;
  onClose?: (closeTab: number) => void;
}

export default IProps;
