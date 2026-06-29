"use client";

import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Input from "..";
import IProps from "./IProps";
import NUMBER from "../../../../libs/infrastructure/shared/NUMBER";
import Utils from "../../../../libs/infrastructure/shared/Utils";

const FormattedDecimal: React.FC<IProps> = ({
  variant,
  color,
  locale = "tr-TR",
  digits,
  validation,
  ...attributes
}: IProps) => {
  const _input = useRef<HTMLInputElement | null>(null);
  const [_value, setValue] = useState<string>("");

  // methods
  const getSeparators = (locale: string) => {
    const parts = new Intl.NumberFormat(locale).formatToParts(1000.1);

    const group = parts.find((p) => p.type === "group")?.value ?? ",";
    const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";

    return { group, decimal };
  };

  const getFormatter = useMemo(() => NUMBER.Decimal(locale, digits), [locale, digits]);

  const handleClick = () => {
    const input = _input.current;
    if (!input) return;

    const caret = input.selectionStart ?? 0;
    input.setSelectionRange(caret, caret + 1);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = _input.current;
    if (!input) return;

    const caret = input.selectionStart ?? 0;

    if (event.code === "ArrowRight") {
      input.setSelectionRange(caret, caret + 1);
    } else if (event.code === "ArrowLeft" && caret > 0) {
      input.setSelectionRange(caret - 1, caret);
    } else if (["ArrowUp", "ArrowDown"].includes(event.code)) {
      input.setSelectionRange(caret, caret + 1);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;

    const { group, decimal } = getSeparators(locale as string);

    // Locale’a göre izin verilen karakterleri temizle.
    const regex = new RegExp(`[^0-9\\${group}\\${decimal}]`, "g");
    value = value.replace(regex, "");

    // Normalize et (decimal her zaman "." olacak şekilde)
    let normalized = value.replace(new RegExp(`\\${group}`, "g"), "").replace(decimal, ".");

    const parsed = parseFloat(normalized);
    const numericValue = isNaN(parsed) ? 0 : parsed;

    const formatted = value === "" ? "" : getFormatter.format(numericValue);

    setValue(formatted);

    // attributes.onChange?.({
    //   ...event,
    //   target: {
    //     ...event.target,
    //     // ...attributes.onChange,
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

    setValue(getFormatter.format(Number(attributes.value)));
  }, [attributes.value, getFormatter]);

  return (
    <Input
      ref={_input}
      variant={variant}
      color={color}
      {...attributes}
      value={_value}
      type="text"
      inputMode="decimal"
      onChange={(event) => {
        if (attributes.disabled) return;

        handleChange(event);
      }}
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      validation={validation}
    />
  );
};

export default FormattedDecimal;
