"use client";

import React, { useCallback, useEffect, useState } from "react";
import Input from "../../../form/input";
import DatePicker from "../../../form/date-picker";
import { Option, TableColumnProps } from "../../../../libs/infrastructure/types";
import Select from "../../../form/select";
import { Config } from "../IProps";
import { ExtractKey, GetColumnValue, PatchColumnValue } from "../Helpers";
import Checkbox from "../../../form/checkbox";

interface IProps<T extends object> {
  c: TableColumnProps<T>;
  item: T;
  trackByValue: string;
  onEditable: (item: T, trackByValue: string, currentKey?: keyof T | null) => void;
  config: Config<T>;
}

const Editable = function <T extends object>({ c, item, trackByValue, onEditable, config }: IProps<T>) {
  // variables
  const itemValue = GetColumnValue(item, c.key);
  const selectItem = c.editable?.(item)?.options?.find((x) => x.value === itemValue);
  // Çoklu seçimde hücre değerini option listesine eşle.
  const selectItems = Array.isArray(itemValue)
    ? (c.editable?.(item)?.options?.filter((x) => itemValue.includes(x.value)) as Option[])
    : [];
  const validation = config.validation;
  // Hata metni kolon + satır kimliğiyle tutuluyor.
  const validationKey = `${String(ExtractKey(c.key) ?? "")}_${trackByValue}`;
  const _vText = validation?.errors?.[validationKey as keyof typeof validation.errors];
  const isDisabled = Boolean(c.editable?.(item)?.where);

  // states
  const [_value, setValue] = useState<string | number | boolean | readonly string[] | undefined>(
    itemValue as string | number | boolean | readonly string[] | undefined,
  );

  // methods
  const handleChange = useCallback(
    (value: unknown, set = true) => {
      // Select'te local state'i güncelleme; option.value doğrudan satıra yazılır.
      if (set) setValue(value as string | number | boolean | readonly string[] | undefined);
      onEditable(PatchColumnValue(item, c.key, value), trackByValue, ExtractKey(c.key));
    },
    [c.key, item, onEditable, trackByValue],
  );

  // useEffects
  useEffect(() => {
    setValue(itemValue as string | number | boolean | readonly string[] | undefined);
  }, [itemValue]);

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
          disabled={isDisabled}
        />
      );
    case "boolean":
      return (
        <Checkbox
          variant="outlined"
          color="blue"
          checked={Boolean(_value)}
          onChange={(event) => {
            handleChange(event.target.checked);
          }}
          validation={{ text: _vText }}
          disabled={isDisabled}
        />
      );
    case "decimal":
      return (
        <Input.Decimal
          variant="borderless"
          name={String(ExtractKey(c.key) ?? "")}
          value={String(_value ?? "")}
          onChange={(event) => handleChange(Number(event.target.value))}
          validation={{ text: _vText }}
          locale={config.locale}
          disabled={isDisabled}
        />
      );
    case "input-formatted-decimal":
      return (
        <Input.FormattedDecimal
          variant="borderless"
          name={String(ExtractKey(c.key) ?? "")}
          value={String(_value ?? "")}
          onChange={(event) => handleChange(Number(event.target.value))}
          validation={{ text: _vText }}
          locale={config.locale}
          disabled={isDisabled}
        />
      );
    case "date-picker":
      return (
        <DatePicker
          variant="borderless"
          value={String(_value ?? "")}
          onChange={(value) => handleChange(value)}
          validation={{ text: _vText }}
          disabled={isDisabled}
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
          disabled={isDisabled}
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
          disabled={isDisabled}
        />
      );
    default:
      return null;
  }
};

export default Editable;
