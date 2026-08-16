"use client";

import { useState } from "react";
import { Steps, Typography } from "@/lib/ui";

const { Paragraph } = Typography;

const STEPS = [
  {
    key: "account",
    title: "Account",
    content: <Paragraph>Create the workspace owner account.</Paragraph>,
  },
  {
    key: "company",
    title: "Company",
    content: <Paragraph>Add the company name and billing profile.</Paragraph>,
  },
  {
    key: "review",
    title: "Review",
    content: <Paragraph>Confirm the details, then continue in your app.</Paragraph>,
  },
];

export function StepsBasic() {
  const [step, setStep] = useState(1);

  return (
    <Steps
      name="docs-steps-basic"
      currentStep={step}
      onChange={setStep}
      config={{ locale: "en" }}
      steps={STEPS}
    />
  );
}
