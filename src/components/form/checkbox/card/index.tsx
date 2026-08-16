"use client";

import React, { useState } from "react";
import Utils from "../../../../libs/infrastructure/shared/Utils";
import IProps from "./Props";
import "../../../../assets/css/components/form/checkbox-card/styles.css";
import Checkbox from "../Checkbox";
import Title from "../../../data-display/typography/title/Title";
import Paragraph from "../../../data-display/typography/paragraph/Paragraph";

const CheckboxCard: React.FC<IProps> = ({
  title,
  description,
  icon,
  variant = "surface",
  color = "blue",
  border = { radius: "6" },
  size = "sm",
  orientation = "vertical",
  validation,
  className,
  ...attributes
}) => {
  // refs
  const _cardClassName: string[] = ["har-checkbox-card"];
  const _contentClassName: string[] = ["content"];

  // states
  const [internalChecked, setInternalChecked] = useState<boolean>(attributes.defaultChecked ?? false);

  const isControlled = attributes.checked !== undefined;
  const isChecked = isControlled ? (attributes.checked ?? false) : internalChecked;

  const _checkboxVariant = attributes.disabled
    ? "surface-borderless"
    : variant === "filled" || variant === "surface" || variant === "surface-borderless"
      ? "filled"
      : variant;

  let _checkboxColor = color;
  if (validation?.text) _checkboxColor = "red";
  else if (attributes.disabled) _checkboxColor = "gray";
  else if (variant === "filled" && color !== "white") _checkboxColor = "white";

  _contentClassName.push(orientation === "horizontal" ? "horizontal" : "vertical");
  _cardClassName.push(isChecked ? "checked" : "unchecked");
  _cardClassName.push(
    ...Utils.GetClassName(
      attributes.disabled ? "surface-borderless" : variant,
      undefined,
      validation?.text ? "red" : attributes.disabled ? "gray" : color,
      border,
      undefined,
      undefined,
      className,
    ),
  );
  if (attributes.disabled) _cardClassName.push("disabled");
  if (icon) _cardClassName.push("has-icon");

  // methods
  const handleToggle = () => {
    (() => {
      if (attributes.disabled) return;

      const nextChecked = !isChecked;

      if (!isControlled) setInternalChecked(nextChecked);

      (() =>
        attributes.onChange &&
        attributes.onChange({
          target: { checked: nextChecked },
        } as React.ChangeEvent<HTMLInputElement>))();
    })();
  };

  return (
    <div className="har-checkbox-card-wrapper">
      <div
        className={_cardClassName.map((c) => c).join(" ")}
        role="checkbox"
        aria-checked={isChecked}
        aria-disabled={attributes.disabled || undefined}
        tabIndex={attributes.disabled ? -1 : 0}
        onClick={() => {
          (() => handleToggle())();
        }}
        onKeyDown={(event) => {
          (() => {
            if (event.key !== " " && event.key !== "Enter") return;

            event.preventDefault();
            handleToggle();
          })();
        }}
      >
        <div className={_contentClassName.map((c) => c).join(" ")}>
          {icon && <span className="icon">{icon}</span>}
          {title && (
            <Title size="md" fontWeight="600">
              {title}
            </Title>
          )}
          {description && <Paragraph size="xs">{description}</Paragraph>}
        </div>

        <Checkbox
          variant={_checkboxVariant}
          color={_checkboxColor}
          size={size}
          checked={isChecked}
          disabled={attributes.disabled}
          name={attributes.name}
          value={attributes.value}
          id={attributes.id}
          tabIndex={-1}
          readOnly
        />
      </div>

      {validation?.text && <div className="har-validation-text">{validation.text}</div>}
    </div>
  );
};

CheckboxCard.displayName = "Checkbox.Card";
export default CheckboxCard;
