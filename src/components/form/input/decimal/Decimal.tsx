"use client";

import React, { ChangeEvent, useRef, useState, useEffect, useMemo } from "react";
import Input from "..";
import IProps from "./IProps";

const Decimal: React.FC<IProps> = ({
  variant,
  color,
  name,
  value,
  onChange,
  placeholder,
  validation,
  disabled,
  locale = "tr-TR",
}) => {
  const _input = useRef<HTMLInputElement | null>(null);
  const [_value, setValue] = useState<string>("");

  // methods
  const decimalSeparator = useMemo(() => {
    const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
    return parts.find((p) => p.type === "decimal")?.value ?? ".";
  }, [locale]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    // Locale’a göre izin verilen karakterler. (rakam, decimal, -)
    const regex = new RegExp(`[^0-9\\${decimalSeparator}-]`, "g");
    inputValue = inputValue.replace(regex, "");

    // Sadece başta negatif işarete izin ver.
    if (inputValue.includes("-")) {
      inputValue = (inputValue.startsWith("-") ? "-" : "") + inputValue.replace(/-/g, "");
    }

    // Tek decimal separator’a izin ver.
    const parts = inputValue.split(decimalSeparator);
    if (parts.length > 2) {
      inputValue = parts[0] + decimalSeparator + parts.slice(1).join("");
    }

    setValue(inputValue);

    // Parent’a normalize edilmiş "." decimal gönder.
    const normalized = inputValue.replace(decimalSeparator, ".");

    onChange?.({
      ...event,
      target: {
        ...event.target,
        name,
        value: normalized,
      },
    });
  };

  // useEffects
  useEffect(() => {
    if (value === undefined || value === null || value === "") {
      setValue("");
      return;
    }

    const stringValue = String(value);
    const localized = stringValue.replace(".", decimalSeparator);

    setValue(localized);
  }, [value, decimalSeparator]);

  return (
    <Input
      ref={_input}
      name={name}
      variant={variant}
      color={color}
      type="text"
      inputMode="decimal"
      value={_value}
      onChange={(e) => {
        if (disabled) return;
        handleChange(e);
      }}
      placeholder={placeholder}
      validation={validation}
      disabled={disabled}
    />
  );
};

export default Decimal;
