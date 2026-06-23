import React from "react";
import "../../../assets/css/components/data-display/divider/divider.css";
import IProps from "./IProps";

const Divider: React.FC<IProps> = ({ config }) => <hr className="ar-divider" style={{ margin: config?.margin }} />;

Divider.displayName = "Divider";
export default Divider;
