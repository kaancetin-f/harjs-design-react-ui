"use client";

import { useState } from "react";
import { Button, Input, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function InputAddonButton() {
  const [copied, setCopied] = useState(false);

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Input placeholder="Search docs">
        <Input.Icon position="start">
          <SearchIcon />
        </Input.Icon>
        <Input.AddonAfter>
          <Button color="blue">Search</Button>
        </Input.AddonAfter>
      </Input>
      <Input value="https://harjs.design" readOnly>
        <Input.AddonAfter>
          <Button
            variant="outlined"
            color="gray"
            onClick={() => {
              void navigator.clipboard.writeText("https://harjs.design");
              setCopied(true);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </Input.AddonAfter>
      </Input>
      <Input placeholder="you@company.com" type="email">
        <Input.AddonAfter>
          <Button color="blue" variant="outlined">
            Subscribe
          </Button>
        </Input.AddonAfter>
      </Input>
    </Flex>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
