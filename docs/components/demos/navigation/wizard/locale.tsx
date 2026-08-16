"use client";

import { useState } from "react";
import { Typography, Wizard } from "@/lib/ui";

const { Paragraph } = Typography;

type Form = { note: string };

export function WizardLocale() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<Form>>({ note: "" });

  return (
    <Wizard
      name="docs-wizard-locale"
      title="Workspace"
      data={{ get: form, set: setForm }}
      currentStep={step}
      onChange={setStep}
      config={{ locale: "en" }}
      steps={[
        {
          key: "one",
          title: "Details",
          content: <Paragraph>Buttons and status text come from the English locale.</Paragraph>,
        },
        {
          key: "two",
          title: "Confirm",
          content: <Paragraph>Default locale is Turkish when config.locale is omitted.</Paragraph>,
        },
      ]}
    />
  );
}

export function WizardEmpty() {
  const [form, setForm] = useState<Partial<Form>>({});

  return (
    <div style={{ height: "16rem" }}>
      <Wizard
        name="docs-wizard-empty"
        title="Empty flow"
        data={{ get: form, set: setForm }}
        onChange={() => undefined}
        config={{ locale: "en" }}
        steps={[]}
      />
    </div>
  );
}
