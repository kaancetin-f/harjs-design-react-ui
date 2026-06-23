"use client";

import React from "react";
import IProps from "./IProps";
import "../../../assets/css/components/navigation/breadcrumb/styles.css";

const Breadcrumb: React.FC<IProps> = () => {
  return <nav className="ar-breadcrumb"></nav>;
};

Breadcrumb.displayName = "Breadcrumb";
export default Breadcrumb;
