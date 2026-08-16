'use client';

import { Input, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function InputIcons() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Input placeholder="Search">
        <Input.Icon position="start">
          <SearchIcon />
        </Input.Icon>
      </Input>
      <Input placeholder="Email">
        <Input.Icon position="start">
          <MailIcon />
        </Input.Icon>
      </Input>
      <Input placeholder="Password" type="password">
        <Input.Icon position="end">
          <LockIcon />
        </Input.Icon>
      </Input>
    </Flex>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.5 10.5 13.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x="2.25"
        y="3.75"
        width="11.5"
        height="8.5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 4.5 8 8.25 13 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x="3.25"
        y="7.25"
        width="9.5"
        height="6.5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5.5 7.25V5.5a2.5 2.5 0 0 1 5 0v1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
