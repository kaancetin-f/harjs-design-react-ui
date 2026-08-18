"use client";

import { useState } from "react";
import { Button, Chip, GridSystem, Paper, Tour, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const STEPS = [
  {
    target: "#tour-docs-search",
    title: "Search",
    description: "Filter the workspace from here. Shortcuts stay on the trailing chip.",
    placement: "bottom" as const,
  },
  {
    target: "#tour-docs-create",
    title: "Create",
    description: "Start a new record. The tour Next control moves you to the next highlight.",
    placement: "bottom" as const,
  },
  {
    target: "#tour-docs-status",
    title: "Status",
    description: "Live health for the current environment. Finish closes the tour.",
    placement: "left" as const,
  },
];

export function TourBasic() {
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
        Start tour
      </Button>

      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
        <span id="tour-docs-search">
          <Chip text="Search ⌘K" color="gray" variant="surface" size="sm" />
        </span>
        <span id="tour-docs-create">
          <Button color="blue" size="sm">
            Create
          </Button>
        </span>
        <span id="tour-docs-status">
          <Chip text="Healthy" color="green" variant="filled" size="sm" />
        </span>
      </Flex>

      <Paper title="Workspace">
        <Paragraph>
          Highlighted controls sit in the toolbar. Previous is hidden on the first step; Finish
          replaces Next on the last step.
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
