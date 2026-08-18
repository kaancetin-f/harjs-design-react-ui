"use client";

import { useEffect, useState } from "react";
import { Button, Chip, GridSystem, Paper, Tour, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const TOUR_NAME = "docs-tour-once";
const STORAGE_KEY = `har-tour::${TOUR_NAME}`;

const STEPS = [
  {
    target: "#tour-docs-once-menu",
    title: "Sidebar",
    description: "This run is stored in localStorage. Reload will not reopen it until you reset.",
  },
  {
    target: "#tour-docs-once-save",
    title: "Save",
    description: "Skip or Finish writes the seen flag. Use Reset seen to play it again.",
  },
];

export function TourOnce() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    setSeen(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const start = () => {
    setStep(0);
    setOpen(true);
  };

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSeen(false);
  };

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
        <Button color="blue" onClick={start}>
          Start once
        </Button>
        <Button variant="outlined" color="gray" onClick={reset}>
          Reset seen
        </Button>
        <Chip text={seen ? "Seen" : "Not seen"} color={seen ? "green" : "gray"} size="sm" />
      </Flex>

      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
        <span id="tour-docs-once-menu">
          <Chip text="Menu" color="orange" variant="surface" size="sm" />
        </span>
        <span id="tour-docs-once-save">
          <Button color="teal" size="sm">
            Save
          </Button>
        </span>
      </Flex>

      <Paper>
        <Paragraph>
          Pass <code>name</code> so Skip and Finish persist. <code>config.once</code> defaults to
          true for uncontrolled auto-start.
        </Paragraph>
      </Paper>

      <Tour
        name={TOUR_NAME}
        steps={STEPS}
        currentStep={step}
        onChange={setStep}
        open={{ get: open, set: setOpen }}
        onSkip={() => {
          setSeen(true);
          setOpen(false);
        }}
        onFinish={() => {
          setSeen(true);
          setOpen(false);
        }}
        config={{ locale: "en", once: true }}
      />
    </Flex>
  );
}
