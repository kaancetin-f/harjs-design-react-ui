'use client';

import { useState } from 'react';
import { Checkbox } from '@/lib/ui';

export function CheckboxValidation() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      label="Accept terms"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      validation={!checked ? { text: 'This field is required' } : undefined}
    />
  );
}

export function CheckboxValidationGroup() {
  const [values, setValues] = useState({
    design: false,
    docs: false,
    a11y: false,
  });

  const hasSelection = Object.values(values).some(Boolean);

  return (
    <Checkbox.Group
      title="Features"
      orientation="vertical"
      color="blue"
      validation={!hasSelection ? { text: 'Select at least one option' } : undefined}
    >
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
