"use client";

import React, { useCallback, useEffect, useState } from "react";
import Input from "../../../form/input";
import DatePicker from "../../../form/date-picker";
import { Option, TableColumnProps } from "../../../../libs/infrastructure/types";
import Select from "../../../form/select";
import { Config } from "../IProps";
import { ExtractKey } from "../Helpers";
import Checkbox from "../../../form/checkbox";

interface IProps<T extends object> {
  c: TableColumnProps<T>;
  item: T;
  trackByValue: string;
  onEditable: (item: T, trackByValue: string, currentKey?: keyof T | null) => void;
  config: Config<T>;
}

const Editable = function <T extends object>({ c, item, trackByValue, onEditable, config }: IProps<T>) {
  // refs

  // variables
  const key = c.key as keyof T;
  const itemValue = item[c.key as keyof T];
  const selectItem = c.editable?.(item)?.options?.find((x) => x.value === itemValue);
  const selectItems = Array.isArray(itemValue)
    ? (c.editable?.(item)?.options?.filter((x) => itemValue.includes(x.value)) as Option[])
    : [];
  const validation = config.validation;
  const _vText = validation?.errors?.[`${c.key as string}_${trackByValue}` as keyof typeof validation.errors];

  // states
  const [_value, setValue] = useState<string | number | boolean | readonly string[] | undefined>(itemValue as string);

  // methods
  const handleChange = useCallback(
    (value: any, set: boolean = true) => {
      if (set) setValue(value);
      onEditable({ ...item, [key]: value } as T, trackByValue, ExtractKey(c.key));
    },
    [item],
  );

  // useEffects
  useEffect(() => setValue(itemValue as string), [itemValue]);

  // return
  switch (c.editable?.(item)?.type) {
    case "string":
    case "number":
      return (
        <Input
          variant="borderless"
          value={String(_value ?? "")}
          onChange={(event) => {
            handleChange(c.editable?.(item)?.type === "number" ? Number(event.target.value) : event.target.value);
          }}
          validation={{ text: _vText }}
          {...(c.editable?.(item).where ? { disabled: c.editable?.(item).where } : {})}
        />
      );
    case "boolean":
      return (
        <Checkbox
          variant="borderless"
          color="blue"
          checked={Boolean(_value)}
          onChange={(event) => {
            const checked = event.target.checked;

            setValue(checked);

            onEditable(
              {
                ...item,
                [key]: checked,
              } as T,
              trackByValue,
              ExtractKey(c.key),
            );
          }}
          validation={{ text: _vText }}
          {...(c.editable?.(item).where ? { disabled: c.editable?.(item).where } : {})}
        />
      );
    case "decimal":
      return (
        <Input.Decimal
          variant="borderless"
          name={c.key as string}
          value={String(_value ?? "")}
          onChange={(event) => handleChange(event.target.value)}
          validation={{ text: _vText }}
          locale={config.locale}
          {...(c.editable?.(item).where ? { disabled: c.editable?.(item).where } : {})}
        />
      );
    case "input-formatted-decimal":
      return (
        <Input.FormattedDecimal
          variant="borderless"
          name={c.key as string}
          value={String(_value ?? "")}
          onChange={(event) => handleChange(event.target.value)}
          validation={{ text: _vText }}
          locale={config.locale}
          {...(c.editable?.(item).where ? { disabled: c.editable?.(item).where } : {})}
        />
      );
    case "date-picker":
      return (
        <DatePicker
          variant="borderless"
          value={String(_value ?? "")}
          onChange={(value) => handleChange(value)}
          validation={{ text: _vText }}
          {...(c.editable?.(item).where ? { disabled: c.editable?.(item).where } : {})}
        />
      );
    case "single-select":
      return (
        <Select
          variant="borderless"
          value={selectItem}
          options={c.editable?.(item).options as Option[]}
          onClick={async () => await c.editable?.(item)?.method?.()}
          onChange={(option) => handleChange(option?.value, false)}
          validation={{ text: _vText }}
          {...(c.editable?.(item).where ? { disabled: c.editable?.(item).where } : {})}
        />
      );
    case "multiple-select":
      return (
        <Select
          variant="borderless"
          value={selectItems}
          options={c.editable?.(item).options as Option[]}
          onClick={async () => await c.editable?.(item)?.method?.()}
          onChange={(options) =>
            handleChange(
              options.map((option) => option.value),
              false,
            )
          }
          validation={{ text: _vText }}
          multiple
          {...(c.editable?.(item).where ? { disabled: c.editable?.(item).where } : {})}
        />
      );
    default:
      return null;
  }
};

export default Editable;
