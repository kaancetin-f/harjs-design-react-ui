"use client";

import { Input, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function InputAddons() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Input placeholder="website">
        <Input.AddonBefore>https://</Input.AddonBefore>
        <Input.AddonAfter>.com</Input.AddonAfter>
      </Input>
      <Input placeholder="Amount">
        <Input.AddonBefore>₺</Input.AddonBefore>
      </Input>
      <Input placeholder="username">
        <Input.AddonAfter>@harjs.design</Input.AddonAfter>
      </Input>
    </Flex>
  );
}
