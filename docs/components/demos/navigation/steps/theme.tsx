"use client";

import { useState } from "react";
import { Steps, Typography } from "@/lib/ui";

const { Paragraph } = Typography;

const STEPS = [
  {
    key: "plan",
    title: "Plan",
    content: <Paragraph>Token names such as purple map to var(--purple-500).</Paragraph>,
  },
  {
    key: "build",
    title: "Build",
    content: <Paragraph>Raw CSS values also work: var(--cyan-500) or #7c3aed.</Paragraph>,
  },
  {
    key: "ship",
    title: "Ship",
    content: <Paragraph>Current, completed, and pending each have their own color.</Paragraph>,
  },
];

function StepsThemeDemo({
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
      config={{
        locale: "en",
        theme: { current: "purple", completed: "teal", pending: "gray" },
      }}
      steps={STEPS}
    />
  );
}

export function StepsThemeHorizontal() {
  return <StepsThemeDemo name="docs-steps-theme-horizontal" variant="horizontal" />;
}

export function StepsThemeVertical() {
  return <StepsThemeDemo name="docs-steps-theme-vertical" variant="vertical" />;
}
