"use client";

import React, { useId } from "react";
import "../../../assets/css/components/data-display/paper/styles.css";
import IProps, { PAPER_ELEVATIONS, PaperElevation } from "./IProps";

const isElevation = (value: number): value is PaperElevation =>
  (PAPER_ELEVATIONS as readonly number[]).includes(value);

const Paper: React.FC<IProps> = ({ children, title, action, elevation = 1 }) => {
  // hooks
  const headingId = useId();

  // variables
  const hasHeader = Boolean(title || action);
  const hasContent = children != null && children !== false;
  // Desteklenmeyen elevation gelirse 1'e düş.
  const level = isElevation(elevation) ? elevation : 1;

  return (
    <section className={`har-paper elevation-${level}`} aria-labelledby={title ? headingId : undefined}>
      {hasHeader && (
        <header className="header">
          {title ? <h3 id={headingId}>{title}</h3> : null}
          {action ? <div className="actions">{action}</div> : null}
        </header>
      )}

      {hasContent ? <div className="content">{children}</div> : null}
    </section>
  );
};

Paper.displayName = "Paper";
export default Paper;
