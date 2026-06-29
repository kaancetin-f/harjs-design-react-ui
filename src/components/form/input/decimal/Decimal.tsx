"use client";

import React, { ChangeEvent, useRef, useState, useEffect, useMemo } from "react";
import Input from "..";
import IProps from "./IProps";
import Utils from "../../../../libs/infrastructure/shared/Utils";

const Decimal: React.FC<IProps> = ({ variant, color, validation, locale = "tr-TR", ...attributes }) => {
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
    // const normalized = inputValue.replace(decimalSeparator, ".");

    // onChange?.({
    //   ...event,
    //   target: {
    //     ...event.target,
    //     name,
    //     value: normalized,
    //   },
    // });
  };

  // useEffects
  useEffect(() => {
    if (Utils.IsNullOrEmpty(attributes.value)) {
      setValue("");
      return;
    }

    const stringValue = String(attributes.value);
    const localized = stringValue.replace(".", decimalSeparator);

    setValue(localized);
  }, [attributes.value, decimalSeparator]);

  return (
    <Input
      ref={_input}
      variant={variant}
      color={color}
      type="text"
      inputMode="decimal"
      {...attributes}
      value={_value}
      onChange={(e) => {
        if (attributes.disabled) return;
        handleChange(e);
      }}
      validation={validation}
    />
  );
};

export default Decimal;
