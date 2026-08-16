"use client";

import { useState } from "react";
import { Typography, Wizard } from "@/lib/ui";

const { Paragraph } = Typography;

type Form = { ok: boolean };

export function WizardKeyboard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Partial<Form>>({ ok: true });

  return (
    <Wizard
      name="docs-wizard-keyboard"
      title="Keyboard"
      description="Tab the sidebar, then Enter or Space."
      data={{ get: form, set: setForm }}
      currentStep={step}
      onChange={setStep}
      config={{ locale: "en" }}
      steps={[
        {
          key: "start",
          title: "Start",
          content: <Paragraph>Completed steps are buttons. Enter or Space goes back.</Paragraph>,
        },
        {
          key: "current",
          title: "Current",
          content: <Paragraph>The current item has aria-current=&quot;step&quot;.</Paragraph>,
        },
        {
          key: "later",
          title: "Later",
          content: <Paragraph>Without validation, future steps stay reachable from the sidebar.</Paragraph>,
        },
      ]}
    />
  );
}
