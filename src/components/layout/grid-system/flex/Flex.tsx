import React from "react";
import IProps from "./IProps";

const Flex: React.FC<IProps> = ({
  children,
  flexDirection = "row",
  flexWrap = "nowrap",
  justifyContent = "flex-start",
  alignItems = "stretch",
  alignContent,
  alignSelf,
  flex,
  flexGrow,
  flexShrink,
  flexBasis,
  gap,
  rowGap,
  columnGap,
  width,
  height,
  inline,
  className: externalClassName,
}) => {
  // variables
  const className = [
    "har-flex",
    inline ? "inline-flex" : "flex",
    flexDirection ? `flex-direction-${flexDirection}` : undefined,
    flexWrap ? `flex-wrap-${flexWrap}` : undefined,
    justifyContent ? `justify-content-${justifyContent}` : undefined,
    alignItems ? `align-items-${alignItems}` : undefined,
    alignContent ? `align-content-${alignContent}` : undefined,
    alignSelf ? `align-self-${alignSelf}` : undefined,
    externalClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {
    ...(flex != null ? { flex } : {}),
    ...(flexGrow != null ? { flexGrow } : {}),
    ...(flexShrink != null ? { flexShrink } : {}),
    ...(flexBasis != null ? { flexBasis } : {}),
    ...(gap != null ? { gap } : {}),
    ...(rowGap != null ? { rowGap } : {}),
    ...(columnGap != null ? { columnGap } : {}),
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
  };

  return (
    <div className={className} style={Object.keys(style).length > 0 ? style : undefined}>
      {children}
    </div>
  );
};

Flex.displayName = "Flex";
export default Flex;
