"use client";

import { useState } from "react";
import { Radio, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function RadioGroupCards() {
  const [vertical, setVertical] = useState("starter");
  const [horizontal, setHorizontal] = useState("starter");

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Radio.Group
        name="vertical-plan"
        title="Vertical"
        orientation="vertical"
        variant="outlined"
        color="blue"
        onChange={(e) => setVertical(e.target.value)}
      >
        <Radio.Card
          title="Starter"
          description="For small teams getting started."
          value="starter"
          checked={vertical === "starter"}
        />
        <Radio.Card
          title="Pro"
          description="Unlimited projects and priority support."
          value="pro"
          checked={vertical === "pro"}
        />
      </Radio.Group>

      <Radio.Group
        name="horizontal-plan"
        title="Horizontal"
        orientation="horizontal"
        variant="outlined"
        onChange={(e) => setHorizontal(e.target.value)}
      >
        <Radio.Card
          title="Starter"
          description="For small teams getting started."
          value="starter"
          color="green"
          checked={horizontal === "starter"}
        />
        <Radio.Card
          title="Pro"
          description="Unlimited projects and priority support."
          value="pro"
          color="orange"
          checked={horizontal === "pro"}
        />
      </Radio.Group>
    </Flex>
  );
}
