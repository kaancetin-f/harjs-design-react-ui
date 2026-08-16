"use client";

import React, { ChangeEvent, useRef, useState, useEffect, useMemo } from "react";
import Input from "..";
import IProps from "./IProps";
import Utils from "../../../../libs/infrastructure/shared/Utils";

const Decimal: React.FC<IProps> = ({ variant, color, validation, locale = "tr-TR", ...attributes }) => {
  // refs
  const _input = useRef<HTMLInputElement | null>(null);
  const _lastEmitted = useRef<string | null>(null);

  // states
  const [_value, setValue] = useState<string>("");

  // methods
  const decimalSeparator = useMemo(() => {
    const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
    return parts.find((p) => p.type === "decimal")?.value ?? ".";
  }, [locale]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    const regex = new RegExp(`[^0-9\\${decimalSeparator}-]`, "g");
    inputValue = inputValue.replace(regex, "");

    if (inputValue.includes("-")) {
      inputValue = (inputValue.startsWith("-") ? "-" : "") + inputValue.replace(/-/g, "");
    }

    const parts = inputValue.split(decimalSeparator);
    if (parts.length > 2) {
      inputValue = parts[0] + decimalSeparator + parts.slice(1).join("");
    }

    setValue(inputValue);

    const normalized = inputValue.replace(decimalSeparator, ".");
    _lastEmitted.current = normalized; // <-- ekle

    attributes.onChange?.({
      ...event,
      target: { ...event.target, value: normalized },
    });
  };

  // useEffects
  useEffect(() => {
    if (Utils.IsNullOrEmpty(attributes.value)) {
      setValue("");
      return;
    }

    const stringValue = String(attributes.value);

    // Parent, az önce gönderdiğimiz değeri (farklı formatta da olsa) aynen
    // yansıtıyorsa, kullanıcının henüz yazmakta olduğu local state'i ezme.
    if (
      _lastEmitted.current !== null &&
      !Number.isNaN(Number(stringValue)) &&
      Number(stringValue) === Number(_lastEmitted.current)
    ) {
      return;
    }

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
