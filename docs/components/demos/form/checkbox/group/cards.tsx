"use client";

import { Checkbox, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function CheckboxGroupCards() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Checkbox.Group title="Vertical" orientation="vertical" variant="outlined" color="blue">
        <Checkbox.Card title="Starter" description="For small teams getting started." defaultChecked />
        <Checkbox.Card title="Pro" description="Unlimited projects and priority support." />
      </Checkbox.Group>

      <Checkbox.Group title="Horizontal" orientation="horizontal" variant="outlined">
        <Checkbox.Card title="Starter" description="For small teams getting started." color="green" defaultChecked />
        <Checkbox.Card title="Pro" description="Unlimited projects and priority support." color="orange" />
      </Checkbox.Group>
    </Flex>
  );
}
