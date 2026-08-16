"use client";

import { Checkbox } from "@/lib/ui";

export function CheckboxCardIcons() {
  return (
    <Checkbox.Group orientation="horizontal" columns={3} variant="outlined" color="gray">
      <Checkbox.Card title="Admin" description="Give full access" icon={<ShieldIcon />} defaultChecked />
      <Checkbox.Card title="User" description="Give limited access" icon={<UserIcon />} />
      <Checkbox.Card title="Guest" description="Give read-only access" icon={<GlobeIcon />} />
      <Checkbox.Card title="Blocked" description="No access" icon={<LockIcon />} />
    </Checkbox.Group>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5.5 19c1.2-3 3.5-4.5 6.5-4.5s5.3 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4 12h16M12 4c2.5 2.8 3.8 5.8 3.8 8S14.5 17.2 12 20c-2.5-2.8-3.8-5.8-3.8-8S9.5 6.8 12 4z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
