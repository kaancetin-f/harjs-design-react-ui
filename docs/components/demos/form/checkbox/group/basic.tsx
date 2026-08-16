"use client";

import { useState } from "react";
import { Checkbox } from "@/lib/ui";

export function CheckboxGroupBasic() {
  const [values, setValues] = useState<Record<string, boolean>>({
    design: true,
    docs: false,
    a11y: false,
  });

  return (
    <Checkbox.Group title="Features" orientation="vertical" color="blue">
      <Checkbox
        label="Design system"
        checked={values.design}
        onChange={(e) => setValues((v) => ({ ...v, design: e.target.checked }))}
      />
      <Checkbox
        label="Documentation"
        checked={values.docs}
        onChange={(e) => setValues((v) => ({ ...v, docs: e.target.checked }))}
      />
      <Checkbox
        label="Accessibility"
        checked={values.a11y}
        onChange={(e) => setValues((v) => ({ ...v, a11y: e.target.checked }))}
      />
    </Checkbox.Group>
  );
}
