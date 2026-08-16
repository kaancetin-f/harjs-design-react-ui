"use client";

import React from "react";
import "../../../assets/css/components/feedback/alert/styles.css";
import IProps, { AlertMessage } from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { Icon } from "../../icons";
import { Icons } from "../../../libs/infrastructure/types";

const STATUS_ICON: Record<string, Icons> = {
  information: "Info",
  success: "CheckCircle",
  warning: "Warning",
  danger: "XCircle",
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const emphasizeText = (text: string, terms?: string[]): React.ReactNode => {
  if (!terms?.length) return text;

  const unique = [...new Set(terms.filter((term) => term.length > 0))];
  if (!unique.length) return text;

  const pattern = unique
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");

  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const matched = unique.some((term) => term.toLocaleLowerCase() === part.toLocaleLowerCase());
    if (!matched || part === "") return part;

    return (
      <span key={index} className="har-alert-tag">
        {part}
      </span>
    );
  });
};

const MessageList = ({
  items,
  nested,
  emphasize,
}: {
  items: AlertMessage[];
  nested?: boolean;
  emphasize?: string[];
}) => (
  <ul>
    {items.map((item, index) =>
      Array.isArray(item) ? (
        <li key={index} className="group">
          <MessageList items={item} nested emphasize={emphasize} />
        </li>
      ) : (
        <li key={index} className={nested ? "message nested" : "message"}>
          {emphasizeText(item, emphasize)}
        </li>
      ),
    )}
  </ul>
);

const Alert: React.FC<IProps> = ({
  children,
  message,
  variant = "surface",
  status = "information",
  border = { radius: "8" },
  emphasize,
  icon,
  className,
  style,
  role,
  config,
  ...attributes
}) => {
  // variables
  const iconPosition = icon?.position ?? "start";
  const iconNode = icon?.element ?? (
    <Icon icon={STATUS_ICON[status] ?? "Info"} size={18} />
  );
  const liveRole = role ?? (status === "danger" || status === "warning" ? "alert" : "status");
  const mark = <span className="icon">{iconNode}</span>;
  const bar =
    config?.bar === true
      ? { side: "start" as const, size: "3" as const }
      : config?.bar
        ? { side: config.bar.side ?? "start", size: config.bar.size ?? "3" }
        : null;

  // refs
  const _alertClassName: string[] = [
    "har-alert",
    `icon-${iconPosition}`,
    ...Utils.GetClassName(variant, status, undefined, border, undefined, undefined, className),
  ].filter(Boolean) as string[];

  if (bar) {
    _alertClassName.push("has-bar", `has-bar-${bar.side}`, `bar-size-${bar.size}`);
  }

  let body: React.ReactNode = children;
  if (message != null && message !== "") {
    body = Array.isArray(message) ? (
      <MessageList items={message} emphasize={emphasize} />
    ) : (
      <p>{emphasizeText(message, emphasize)}</p>
    );
  }

  return (
    <div {...attributes} className={_alertClassName.map((c) => c).join(" ")} style={style} role={liveRole}>
      {iconPosition === "start" ? mark : null}
      <div className="body">{body}</div>
      {iconPosition === "end" ? mark : null}
    </div>
  );
};

Alert.displayName = "Alert";
export default Alert;
