"use client";

import { useState } from "react";
import { Steps, Typography } from "@/lib/ui";

const { Paragraph } = Typography;

export function StepsLocale() {
  const [step, setStep] = useState(0);

  return (
    <Steps
      name="docs-steps-locale"
      currentStep={step}
      onChange={setStep}
      config={{ locale: "en" }}
      labels={{ back: "Previous", next: "Continue", step: "Stage" }}
      steps={[
        {
          key: "one",
          title: "Details",
          content: <Paragraph>Custom labels override the locale strings.</Paragraph>,
        },
        {
          key: "two",
          title: "Confirm",
          content: <Paragraph>Locale still drives the screen-reader status text.</Paragraph>,
        },
      ]}
    />
  );
}
