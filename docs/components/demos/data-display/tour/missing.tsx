"use client";

import { useState } from "react";
import { Button, Chip, GridSystem, Paper, Tour, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const STEPS = [
  {
    target: "#tour-docs-missing-found",
    title: "Known target",
    description: "This step resolves. Next points at a selector that is not in the DOM.",
  },
  {
    target: "#tour-docs-missing-absent",
    title: "Missing target",
    description: "The selector does not match. The overlay stays up and the panel is centered.",
  },
  {
    target: "#tour-docs-missing-again",
    title: "Back on track",
    description: "A missing target must not crash the tour. Finish still closes it.",
  },
];

export function TourMissing() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Button
        color="blue"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
      >
        Start with a missing step
      </Button>

      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
        <span id="tour-docs-missing-found">
          <Chip text="Present" color="blue" variant="surface" size="sm" />
        </span>
        <span id="tour-docs-missing-again">
          <Chip text="Also present" color="teal" variant="surface" size="sm" />
        </span>
      </Flex>

      <Paper>
        <Paragraph>
          Step 2 uses <code>#tour-docs-missing-absent</code>, which is never rendered. The panel
          falls back to the viewport center.
        </Paragraph>
      </Paper>

      <Tour
        steps={STEPS}
        currentStep={step}
        onChange={setStep}
        open={{ get: open, set: setOpen }}
        onSkip={() => setOpen(false)}
        onFinish={() => setOpen(false)}
        config={{ locale: "en" }}
      />
    </Flex>
  );
}
