import {
  IBorderProps,
  IChildrenProps,
  IStatusProps,
  IVariantProps,
} from "../../../libs/infrastructure/types/IGlobalProps";

type message = string | message[];

interface IProps
  extends IChildrenProps, IVariantProps<{ component: "alert" }>, IStatusProps<{ component: "alert" }>, IBorderProps {
  message?: message;
  emphasize?: string[];
}

export default IProps;
