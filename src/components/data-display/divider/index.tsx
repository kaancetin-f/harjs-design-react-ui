import React from "react";
import "../../../assets/css/components/data-display/divider/styles.css";
import IProps from "./IProps";

const Divider: React.FC<IProps> = ({
  children,
  orientation = "horizontal",
  variant = "fade",
  align = "center",
  color = "gray",
  config,
}) => {
  // variables
  const labeled = Boolean(children);
  const className = [
    "har-divider",
    color,
    `is-${orientation}`,
    `is-${variant}`,
    labeled ? `align-${align}` : undefined,
    labeled ? "has-label" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={className}
      style={config?.margin != null ? { margin: config.margin } : undefined}
    >
      <span className="line" aria-hidden />
      {labeled ? <span className="label">{children}</span> : null}
      {labeled ? <span className="line" aria-hidden /> : null}
    </div>
  );
};

Divider.displayName = "Divider";
export default Divider;
