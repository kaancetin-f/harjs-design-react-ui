import { ComponentProps } from "react";

import Input from "../input";

interface IProps extends Omit<ComponentProps<typeof Input>, "onChange"> {
  onChange: (value: string) => void;
  config?: {
    locale?: Intl.LocalesArgument;
    isClock?: boolean;
    isFooterButton?: boolean;
  };
}

export default IProps;
