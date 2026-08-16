"use client";

import { useState } from "react";
import { Steps, Typography } from "@/lib/ui";

const { Paragraph } = Typography;

const STEPS = [
  {
    key: "account",
    title: "Account",
    icon: "Folder" as const,
    content: <Paragraph>Pending and current badges show the step icon.</Paragraph>,
  },
  {
    key: "company",
    title: "Company",
    icon: "Document" as const,
    content: <Paragraph>Completed badges keep the check.</Paragraph>,
  },
  {
    key: "payment",
    title: "Payment",
    icon: "CreditCard" as const,
    content: <Paragraph>The same icon name works in horizontal and vertical tracks.</Paragraph>,
  },
];

function StepsIconsDemo({
  name,
  variant,
}: {
  name: string;
  variant: "horizontal" | "vertical";
}) {
  const [step, setStep] = useState(1);

  return (
    <Steps
      name={name}
      currentStep={step}
      onChange={setStep}
      variant={variant}
      config={{ locale: "en" }}
      steps={STEPS}
    />
  );
}

export function StepsIconsHorizontal() {
  return <StepsIconsDemo name="docs-steps-icons-horizontal" variant="horizontal" />;
}

export function StepsIconsVertical() {
  return <StepsIconsDemo name="docs-steps-icons-vertical" variant="vertical" />;
}
