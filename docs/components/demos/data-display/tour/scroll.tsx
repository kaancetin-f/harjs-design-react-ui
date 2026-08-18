"use client";

import { useState } from "react";
import { Button, Chip, GridSystem, Paper, Tour, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const STEPS = [
  {
    target: "#tour-docs-scroll-top",
    title: "Above the fold",
    description: "Next targets a control that starts below the visible area.",
    placement: "bottom" as const,
  },
  {
    target: "#tour-docs-scroll-bottom",
    title: "Scrolled into view",
    description: "If the target is outside the viewport, Tour scrolls it into place before highlighting.",
    placement: "top" as const,
  },
];

export function TourScroll() {
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
        Start scroll tour
      </Button>

      <span id="tour-docs-scroll-top">
        <Chip text="Top action" color="purple" variant="surface" size="sm" />
      </span>

      <div
        style={{
          maxHeight: 160,
          overflow: "auto",
          border: "solid var(--stroke-1) var(--gray-200)",
          borderRadius: "var(--radius-8)",
        }}
      >
        <div style={{ height: 280 }} />
        <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-16)" }}>
          <span id="tour-docs-scroll-bottom">
            <Chip text="Below the fold" color="pink" variant="filled" size="sm" />
          </span>
        </div>
      </div>

      <Paper>
        <Paragraph>
          The second target sits in a nested overflow sheet. Tour scrolls that container — then the page if needed —
          before measuring the spotlight.
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
