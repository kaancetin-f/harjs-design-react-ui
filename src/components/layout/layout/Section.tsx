import React from "react";
import { ILayoutSectionProps } from "./IProps";
import { cssVars } from "./helpers";

const Section: React.FC<ILayoutSectionProps> = ({ children, fullWidth, maxWidth, className, style }) => {
  // refs
  const _sectionClassName: string[] = ["har-section", fullWidth ? "full-width" : "", className].filter(
    Boolean,
  ) as string[];

  // variables
  const sectionStyle = {
    ...cssVars({
      "--har-layout-section-max-width": maxWidth,
    }),
    ...style,
  };

  return (
    <section className={_sectionClassName.map((c) => c).join(" ")} style={sectionStyle}>
      {children}
    </section>
  );
};

Section.displayName = "Layout.Section";
export default Section;
