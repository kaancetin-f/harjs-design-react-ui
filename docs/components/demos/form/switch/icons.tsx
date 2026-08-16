"use client";

import { useState } from "react";
import { Switch, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function SwitchIcons() {
  const [dark, setDark] = useState(false);
  const [available, setAvailable] = useState(true);

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-16)">
      <Switch
        label="Dark mode"
        color="purple"
        checked={dark}
        onChange={(e) => setDark(e.target.checked)}
        icon={{
          checked: <MoonIcon />,
          unchecked: <SunIcon />,
        }}
      />
      <Switch
        label="Available"
        color="green"
        checked={available}
        onChange={(e) => setAvailable(e.target.checked)}
        icon={{
          checked: <CheckIcon />,
          unchecked: <CloseIcon />,
        }}
      />
    </Flex>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.25 9.15A5.25 5.25 0 0 1 6.85 2.75 5.5 5.5 0 1 0 13.25 9.15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
