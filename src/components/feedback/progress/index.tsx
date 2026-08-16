import React, { useId } from "react";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { getProgressColor, normalizeProgressValue } from "./helpers";
import "../../../assets/css/components/feedback/progress/styles.css";

const Progress: React.FC<IProps> = ({
  value,
  reverse = false,
  isVisibleValue = false,
  color,
  size = "md",
  type = "line",
}) => {
  // hooks
  const shineGradientId = `har-progress-shine-${useId().replace(/:/g, "")}`;

  // variables
  const normalized = normalizeProgressValue(value);
  const resolvedColor = getProgressColor(value, color, reverse);
  const percentLabel = `${Math.round(normalized)}%`;
  const colorClassName = Utils.GetClassName(
    undefined,
    undefined,
    resolvedColor,
    { radius: "full" },
    size,
    undefined,
    undefined,
  );
  const className = [
    "har-progress",
    `type-${type}`,
    isVisibleValue ? "is-visible-value" : undefined,
    normalized <= 0 ? "is-idle" : undefined,
    normalized >= 100 ? "is-complete" : undefined,
    ...colorClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const style = {
    "--har-progress-value": String(normalized),
  } as React.CSSProperties;

  return (
    <div
      className={className}
      style={style}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalized)}
    >
      {type === "circle" ? (
        <>
          <svg viewBox="0 0 36 36" aria-hidden>
            <defs>
              <linearGradient
                id={shineGradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="var(--white-alpha-50)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--white-alpha-50)" />
                <stop offset="100%" stopColor="var(--white-alpha-50)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle className="bar" cx="18" cy="18" r="16" pathLength="100" />
            <circle className="value" cx="18" cy="18" r="16" pathLength="100" />
            <circle
              className="shine"
              cx="18"
              cy="18"
              r="16"
              pathLength="100"
              stroke={`url(#${shineGradientId})`}
            />
          </svg>
          <span className="percent">{percentLabel}</span>
        </>
      ) : (
        <>
          <div className={`bar ${colorClassName.join(" ")}`} aria-hidden />
          <div className={`value ${colorClassName.join(" ")}`} aria-hidden>
            <span className="shine" />
            <span>{percentLabel}</span>
          </div>
        </>
      )}
    </div>
  );
};

Progress.displayName = "Progress";

export default Progress;
