import { TabProps } from "../../../libs/infrastructure/types";

export type TabsVariant = "underline" | "pill" | "segmented" | "folder" | "minimal";
export type TabsOrientation = "horizontal" | "vertical";

interface IProps {
  /**
   * Storage and a11y id prefix. When set, the active index is stored in `sessionStorage`
   * under the current path and this name — unless `activeTab` is controlled.
   */
  name: string;
  tabs: TabProps[];
  /**
   * Controlled active index. When set, `sessionStorage` does not override it.
   */
  activeTab?: number;
  /**
   * Uncontrolled initial index when `activeTab` is omitted and nothing is stored.
   */
  defaultActiveTab?: number;
  /**
   * Tab chrome. Default `underline`.
   */
  variant?: TabsVariant;
  /**
   * Tab list axis. Default `horizontal`.
   */
  orientation?: TabsOrientation;
  onChange?: (currentTab: number) => void;
  onClose?: (closeTab: number) => void;
}

export default IProps;
