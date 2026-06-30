"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Input from "..";
import IProps from "./IProps";
import Select from "../../select";
import { Option } from "../../../../libs/infrastructure/types";
import PHONE from "../../../../libs/infrastructure/shared/PHONE";

const Phone: React.FC<IProps> = ({
  variant,
  color,
  options,
  values,
  onSelected,
  validation,
  ...attributes
}: IProps) => {
  // refs
  const _input = useRef<HTMLInputElement | null>(null);

  // states
  const [_value, setValue] = useState<string | number | readonly string[] | undefined>("");
  const [selected, setSelected] = useState<Option | undefined>(undefined);

  // options referans kararlılığı için JSON key
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const optionsKey = useMemo(() => JSON.stringify(options), [options]);

  // methods
  const handleClick = () => {
    const input = _input.current;

    if (!input) return;

    const caret = input.selectionStart ?? 0;
    input.setSelectionRange(caret, caret + 1);
  };

  // useEffects
  useEffect(() => {
    setValue(values.value);
    setSelected(options?.find((option) => option.value === values.option));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.value, values.option, optionsKey]);

  return (
    <div className="ar-input-phone-wrapper">
      {options && (
        <Select
          style={{ width: 130 }}
          variant="outlined"
          color="gray"
          options={options}
          value={selected}
          onChange={(option) => {
            onSelected?.(option);
            setSelected(option);
          }}
          validation={validation}
          config={{ validation: { text: "hidden" } }}
        />
      )}

      <Input
        ref={_input}
        {...attributes}
        {...(!options ? { style: { borderRadius: "var(--radius-4)" } } : {})}
        variant={variant}
        color={color}
        value={PHONE.FormatByMask(selected?.value as string, _value as string)}
        type="tel"
        inputMode="decimal"
        onChange={(event) => {
          if (attributes.disabled) return;

          setValue(event.target.value);
          attributes.onChange?.(event);
        }}
        onClick={handleClick}
        validation={validation}
      />
    </div>
  );
};

export default Phone;
