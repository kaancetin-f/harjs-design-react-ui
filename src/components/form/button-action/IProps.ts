import { IColorProps, IIconProps } from "../../../libs/infrastructure/types/IGlobalProps";

interface IProps {
  buttons: ({
    text: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  } & IColorProps &
    IIconProps)[];
}

export default IProps;
