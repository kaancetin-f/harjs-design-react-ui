import {
  IBorderProps,
  IColorProps,
  IDisabledProps,
  IValidationProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";
import { Color } from "../../../libs/infrastructure/types";

export interface IProps<T>
  extends IValidationProps,
    IColorProps,
    IDisabledProps,
    IVariantProps<{ component: "text-editor" }>,
    IBorderProps {
  name?: string;
  value?: string;
  onChange: (value?: string) => void;
  dynamicList?: {
    render: {
      display: keyof T;
      items: T[];
    };
    triggerKey?: string;
    color?: Color;
    onTagged: (tagged: T[]) => void;
  };
  height?: number;
  multilang?: boolean;
  placeholder?: string;
}

export default IProps;
