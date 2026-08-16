"use client";

import { useState } from "react";
import { Button, Input, Select, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

type Option = { value: string | number | null; text: string };

const protocols: Option[] = [
  { value: "https", text: "https://" },
  { value: "http", text: "http://" },
];

const currencies: Option[] = [
  { value: "TRY", text: "TRY" },
  { value: "USD", text: "USD" },
  { value: "EUR", text: "EUR" },
];

const units: Option[] = [
  { value: "kg", text: "kg" },
  { value: "lb", text: "lb" },
  { value: "g", text: "g" },
];

export function InputAddonSelect() {
  const [protocol, setProtocol] = useState<Option | undefined>(protocols[0]);
  const [currency, setCurrency] = useState<Option | undefined>(currencies[0]);
  const [unit, setUnit] = useState<Option | undefined>(units[0]);

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Input placeholder="harjs.design">
        <Input.AddonBefore>
          <Select
            variant="outlined"
            color="gray"
            options={protocols}
            value={protocol}
            onChange={setProtocol}
            config={{ clear: false }}
            style={{ width: 118 }}
          />
        </Input.AddonBefore>
        <Input.AddonAfter>
          <Button color="blue">Go</Button>
        </Input.AddonAfter>
      </Input>
      <Input placeholder="Amount">
        <Input.AddonBefore>
          <Select
            variant="outlined"
            color="gray"
            options={currencies}
            value={currency}
            onChange={setCurrency}
            config={{ clear: false }}
            style={{ width: 108 }}
          />
        </Input.AddonBefore>
      </Input>
      <Input placeholder="Weight">
        <Input.AddonAfter>
          <Select
            variant="outlined"
            color="gray"
            options={units}
            value={unit}
            onChange={setUnit}
            config={{ clear: false }}
            style={{ width: 108 }}
          />
        </Input.AddonAfter>
      </Input>
    </Flex>
  );
}
