"use client";

import { useState } from "react";
import { Button, Card, Checkbox, GridSystem, Input, Select } from "@/lib/ui";

const { Flex } = GridSystem;

type Option = { value: string | number | null; text: string };

const roles: Option[] = [
  { value: "editor", text: "Editor" },
  { value: "viewer", text: "Viewer" },
  { value: "admin", text: "Admin" },
];

export function CardForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Option | undefined>(roles[0]);
  const [notify, setNotify] = useState(true);

  return (
    <Card
      title="Invite teammate"
      actions={
        <Button variant="borderless" color="gray" size="sm" type="button">
          Cancel
        </Button>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Flex flexDirection="column" gap="var(--space-16)">
          <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)}>
            <Input.Icon position="start">
              <UserIcon />
            </Input.Icon>
          </Input>
          <Input placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)}>
            <Input.Icon position="start">
              <MailIcon />
            </Input.Icon>
          </Input>
          <Select placeholder="Role" options={roles} value={role} onChange={setRole} />
          <Checkbox
            label="Send an invite email"
            checked={notify}
            onChange={(event) => setNotify(event.target.checked)}
          />
          <Button type="submit" color="blue" fullWidth>
            Send invite
          </Button>
        </Flex>
      </form>
    </Card>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="5.25" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.25 13.25c.7-2.15 2.4-3.25 4.75-3.25s4.05 1.1 4.75 3.25"
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
      <rect x="2.25" y="3.75" width="11.5" height="8.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
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
