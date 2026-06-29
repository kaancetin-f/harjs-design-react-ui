import React, { useEffect, useState } from "react";
import IProps from "./IProps";
import Utils from "../../../../libs/infrastructure/shared/Utils";

const Flex: React.FC<IProps> = ({
  children,

  flexDirection = "row",
  flexWrap = "nowrap",

  justifyContent = "flex-start",
  alignItems = "stretch",
  alignContent,

  flex,
  flexGrow = 0,
  flexShrink = 1,
  flexBasis,

  gap,
  rowGap,
  columnGap,
}) => {
  // states
  const [classNames, setClassNames] = useState<string[]>(["flex"]);

  // useEffects
  useEffect(() => {
    if (flexDirection) setClassNames((prev) => [...prev, `flex-direction-${flexDirection}`]);
    if (flexWrap) setClassNames((prev) => [...prev, `flex-wrap-${flexWrap}`]);

    if (justifyContent) setClassNames((prev) => [...prev, `justify-content-${justifyContent}`]);
    if (alignItems) setClassNames((prev) => [...prev, `align-items-${alignItems}`]);
    if (alignContent) setClassNames((prev) => [...prev, `align-content-${alignContent}`]);

    // Runtime
    const className = `css-${Utils.RandomCharacterGenerator(15)}`;
    const style = document.createElement("style");

    let css = `.${className} {`;

    if (flex) css += `flex: ${flex};`;
    if (flexGrow !== undefined) css += `flex-grow: ${flexGrow};`;
    if (flexShrink !== undefined) css += `flex-shrink: ${flexShrink};`;
    if (flexBasis) css += `flex-basis: ${flexBasis};`;

    if (gap) css += `gap: ${gap};`;
    if (rowGap) css += `row-gap: ${rowGap};`;
    if (columnGap) css += `column-gap: ${columnGap};`;

    css += "}";

    style.textContent = css;

    setClassNames((prev) => [...prev, className]);
    document.head.appendChild(style);

    return () => {
      setClassNames([]);
      document.head.removeChild(style);
    };
  }, []);

  return <div className={classNames.map((c) => c).join(" ")}>{children}</div>;
};

export default Flex;
