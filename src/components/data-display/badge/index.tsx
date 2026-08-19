"use client";

import React from "react";
import "../../../assets/css/components/data-display/badge/styles.css";
import IProps from "./IProps";
import BadgeRibbon from "./Ribbon";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { DEFAULT_OVERFLOW_COUNT, formatBadgeCount, shouldShowBadgeCount } from "./helpers";

const accentStyle = (color?: IProps["color"]): React.CSSProperties | undefined =>
  color
    ? {
        ["--_badge-accent" as string]: `var(--${color}-500)`,
        ["--_badge-accent-hover" as string]: `var(--${color}-400)`,
        ["--_badge-fg" as string]: `var(--${color}-700)`,
      }
    : undefined;

const Mark: React.FC<{
  className: string;
  style?: React.CSSProperties;
  dot?: boolean;
  label?: string;
}> = ({ className, style, dot, label }) => (
  <span className={className} style={style} aria-hidden={dot || undefined}>
    {dot ? <span className="har-badge-dot" /> : <span className="har-badge-count">{label}</span>}
  </span>
);

const BadgeBase: React.FC<IProps> = ({
  children,
  variant,
  status,
  color,
  size = "md",
  border = { radius: "full" },
  text,
  count,
  dot,
  icon,
  upperCase,
  disabled,
  className,
  onClick,
  config,
  style,
  ...attributes
}) => {
  const iconPosition = icon?.position ?? "start";
  const hasText = !Utils.IsNullOrEmpty(text);
  const hasIcon = Boolean(icon?.element);
  const hasChildren = children != null && children !== false;
  const showCount = shouldShowBadgeCount(count, config?.showZero);
  const markLabel = showCount
    ? formatBadgeCount(count as number | string, config?.overflowCount ?? DEFAULT_OVERFLOW_COUNT)
    : undefined;
  const interactive = typeof onClick === "function";
  const label = hasText && upperCase ? text!.toLocaleUpperCase() : text;
  const isToken = hasIcon;
  const countStatus = color ? undefined : (status ?? "danger");
  const statusTone = color ? undefined : (status ?? "secondary");
  const vars = accentStyle(color);
  const offset = config?.offset;

  const markClass = (tone: IProps["status"], extra?: string) =>
    [
      "har-badge",
      ...Utils.GetClassName("filled", tone, undefined, border, size, undefined, extra),
      dot || (!showCount && !isToken) ? "dot" : undefined,
      disabled ? "disabled" : undefined,
      tone === "information" ? "pulse" : undefined,
    ]
      .filter(Boolean)
      .join(" ");

  if (hasChildren) {
    const hostClass = ["har-badge-host", disabled ? "disabled" : undefined, className].filter(Boolean).join(" ");
    return (
      <span {...attributes} className={hostClass} style={style}>
        {children}
        {dot || showCount ? (
          <Mark
            className={markClass(countStatus, "overlay")}
            style={
              {
                ...vars,
                ...(offset
                  ? {
                      ["--_badge-offset-x" as string]: `${offset[0]}px`,
                      ["--_badge-offset-y" as string]: `${offset[1]}px`,
                    }
                  : {}),
              } as React.CSSProperties
            }
            dot={dot}
            label={markLabel}
          />
        ) : null}
      </span>
    );
  }

  if (!isToken && (dot || showCount || hasText || status)) {
    if (showCount && !hasText && !dot) {
      return (
        <Mark
          className={[markClass(countStatus), className].filter(Boolean).join(" ")}
          style={{ ...vars, ...style }}
          label={markLabel}
        />
      );
    }

    const statusClass = [
      "har-badge-status",
      ...Utils.GetClassName(undefined, statusTone, undefined, undefined, size, undefined, className),
      disabled ? "disabled" : undefined,
      statusTone === "information" ? "pulse" : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span {...attributes} className={statusClass} style={style} aria-disabled={disabled || undefined}>
        <Mark className={markClass(statusTone)} style={vars} dot={dot || !showCount} label={markLabel} />
        {hasText ? <span className="label">{label}</span> : null}
      </span>
    );
  }

  const tokenClass = [
    "har-badge",
    "token",
    ...Utils.GetClassName(variant ?? "surface", statusTone, undefined, border, size, undefined, className),
    hasIcon ? `icon-${iconPosition}` : undefined,
    hasIcon && !hasText ? "icon-only" : undefined,
    disabled ? "disabled" : undefined,
    interactive ? "interactive" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      {hasIcon && iconPosition === "start" ? <span className="icon">{icon!.element}</span> : null}
      {hasText ? <span className="label">{label}</span> : null}
      {hasIcon && iconPosition === "end" ? <span className="icon">{icon!.element}</span> : null}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        {...(attributes as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        className={tokenClass}
        style={{ ...vars, ...style }}
        disabled={disabled}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      >
        {body}
      </button>
    );
  }

  return (
    <span {...attributes} className={tokenClass} style={{ ...vars, ...style }} aria-disabled={disabled || undefined}>
      {body}
    </span>
  );
};

type BadgeComponent = typeof BadgeBase & { Ribbon: typeof BadgeRibbon };

const Badge = BadgeBase as BadgeComponent;
Badge.Ribbon = BadgeRibbon;
Badge.displayName = "Badge";

export default Badge;
