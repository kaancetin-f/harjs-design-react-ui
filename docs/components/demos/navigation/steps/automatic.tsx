"use client";

import { useState } from "react";
import { Button, Steps, Typography, GridSystem } from "@/lib/ui";

const { Paragraph } = Typography;
const { Flex } = GridSystem;

export function StepsAutomatic() {
  const [step, setStep] = useState(0);

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Steps
        name="docs-steps-automatic"
        currentStep={step}
        onChange={setStep}
        config={{ locale: "en", isAutomatic: true }}
        steps={[
          {
            key: "sync",
            title: "Sync",
            content: <Paragraph>The parent owns this step. The track is not clickable.</Paragraph>,
          },
          {
            key: "map",
            title: "Map",
            content: <Paragraph>Advance with the buttons below the stepper.</Paragraph>,
          },
          {
            key: "done",
            title: "Done",
            content: <Paragraph>No Back/Next inside Steps when automatic.</Paragraph>,
          },
        ]}
      />
      <Flex gap="var(--space-8)">
        <Button
          type="button"
          variant="outlined"
          color="gray"
          disabled={step === 0}
          onClick={() => setStep((current) => current - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          color="blue"
          disabled={step === 2}
          onClick={() => setStep((current) => current + 1)}
        >
          Continue
        </Button>
      </Flex>
    </Flex>
  );
}
