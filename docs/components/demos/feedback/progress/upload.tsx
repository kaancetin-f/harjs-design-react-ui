"use client";

import { useEffect, useState } from "react";
import { Button, GridSystem, Progress, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const TASKS = [
  { label: "Design tokens", value: 100 },
  { label: "Component API", value: 76 },
  { label: "Documentation", value: 42 },
];

export function ProgressUpload() {
  const [percent, setPercent] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (percent >= 100) {
      setRunning(false);
      return;
    }

    const id = setTimeout(() => {
      setPercent((current) => Math.min(100, current + 2));
    }, 40);

    return () => clearTimeout(id);
  }, [running, percent]);

  return (
    <Flex flexDirection="column" gap="var(--space-20)" width="100%">
      <Flex flexDirection="column" gap="var(--space-12)" width="100%">
        <Paragraph>Sprint 24</Paragraph>
        {TASKS.map((task) => (
          <Flex
            key={task.label}
            flexDirection="column"
            gap="var(--space-8)"
            width="100%"
          >
            <Paragraph>
              {task.label} · {task.value}%
            </Paragraph>
            <Progress value={task.value} />
          </Flex>
        ))}
      </Flex>
      <Flex flexDirection="column" gap="var(--space-12)" width="100%">
        <Paragraph>
          {percent >= 100 ? "tokens.json uploaded" : "Upload tokens.json"}
        </Paragraph>
        <Progress value={percent} isVisibleValue />
        <Flex gap="var(--space-8)">
          <Button
            variant="filled"
            color="blue"
            disabled={running}
            onClick={() => {
              setPercent(0);
              setRunning(true);
            }}
          >
            {percent >= 100 ? "Upload again" : "Start upload"}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
