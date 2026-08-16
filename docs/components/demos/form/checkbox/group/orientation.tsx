"use client";

import { Checkbox } from "@/lib/ui";

export function CheckboxGroupOrientation() {
  return (
    <Checkbox.Group title="Horizontal" orientation="horizontal" color="blue">
      <Checkbox label="One" defaultChecked />
      <Checkbox label="Two" />
      <Checkbox label="Three" />
    </Checkbox.Group>
  );
}
