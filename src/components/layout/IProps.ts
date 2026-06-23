import React from "react";
import { IChildrenProps } from "../../libs/infrastructure/types/IGlobalProps";

export interface ILayoutProps extends IChildrenProps {}
export interface IHeaderProps {
  actions?: React.ReactNode;
}
export interface ILSiderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: {
    default: React.ReactElement<SVGElement | HTMLImageElement>;
    mini: React.ReactElement<SVGElement | HTMLImageElement>;
    onClick?: () => void;
  };
  footer?: string;
}
export interface IMainProps extends IChildrenProps {}
export interface ISectionProps extends IChildrenProps {
  fullWidth?: boolean;
}
