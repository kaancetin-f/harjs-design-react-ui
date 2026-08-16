import React from "react";
import "../../../assets/css/components/feedback/spinner/styles.css";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const Spinner: React.FC<IProps> = ({
  size = "md",
  status = "primary",
  label = "Loading",
  className,
  style,
  role,
  ...attributes
}) => {
  // refs
  const _spinnerClassName: string[] = [
    "har-spinner",
    ...Utils.GetClassName(
      undefined,
      status,
      undefined,
      undefined,
      size,
      undefined,
      className,
    ),
  ];

  // variables
  const decorative = label === "";

  return (
    <span
      {...attributes}
      className={_spinnerClassName.join(" ")}
      style={style}
      role={decorative ? undefined : (role ?? "status")}
      aria-live={decorative ? undefined : "polite"}
      aria-busy={decorative ? undefined : true}
      aria-hidden={decorative || undefined}
    >
      {!decorative ? <span className="label">{label}</span> : null}
      <span className="track" aria-hidden />
    </span>
  );
};

Spinner.displayName = "Spinner";
export default Spinner;
