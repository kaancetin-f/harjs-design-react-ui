'use client';

import { Alert, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const variants = [
  { variant: 'surface', note: 'Default. Soft wash and a 1px frame, same contract as Button surface.' },
  { variant: 'filled', note: 'Solid banner. Use when the message has to stop the page.' },
  { variant: 'surface-borderless', note: 'Same wash, no frame. Sits flush in grouped layouts.' },
  { variant: 'outlined', note: 'Hairline frame. Quieter than surface, still a container.' },
  { variant: 'dashed', note: 'Draft or incomplete. The frame is the signal.' },
  { variant: 'borderless', note: 'Copy and icon only. For dense stacks.' },
] as const;

function Label({ children }: { children: string }) {
  return (
    <span
      style={{
        display: 'block',
        marginBottom: 'var(--space-8)',
        color: 'var(--gray-500)',
        fontFamily: 'var(--system)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

export function AlertVariants() {
  return (
    <Flex flexDirection="column" gap="var(--space-20)" width="100%">
      {variants.map((item) => (
        <div key={item.variant}>
          <Label>{item.variant}</Label>
          <Alert variant={item.variant} status="warning" message={item.note} />
        </div>
      ))}
    </Flex>
  );
}
