import React from "react";
import { IMainProps } from "./IProps";

const Main: React.FC<IMainProps> = ({ children }) => <main>{children}</main>;

Main.displayName = "Layout.Main";
export default Main;
