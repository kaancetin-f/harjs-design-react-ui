'use client';

import { Button, Card, Chip, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const people = [
  {
    initials: 'AL',
    name: 'Ada Lovelace',
    role: 'Staff engineer',
    tone: { bg: 'var(--blue-100)', fg: 'var(--blue-700)' },
    chip: { text: 'Online', color: 'green' as const },
  },
  {
    initials: 'GH',
    name: 'Grace Hopper',
    role: 'Design lead',
    tone: { bg: 'var(--purple-100)', fg: 'var(--purple-700)' },
    chip: { text: 'In a meeting', color: 'orange' as const },
  },
  {
    initials: 'AT',
    name: 'Alan Turing',
    role: 'Research',
    tone: { bg: 'var(--teal-100)', fg: 'var(--teal-700)' },
    chip: { text: 'Away', color: 'gray' as const },
  },
];

export function CardTeam() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
      {people.map((person) => (
        <div key={person.name} style={{ flex: '1 1 16rem', minWidth: 0 }}>
          <Card>
            <Flex flexDirection="column" gap="var(--space-16)">
              <Flex alignItems="center" gap="var(--space-12)">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '999px',
                    background: person.tone.bg,
                    color: person.tone.fg,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    flexShrink: 0,
                  }}
                >
                  {person.initials}
                </span>
                <Flex flexDirection="column" gap="var(--space-2)" flexGrow={1}>
                  <span style={{ fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.3 }}>{person.name}</span>
                  <Paragraph size="sm" color="gray-500">
                    {person.role}
                  </Paragraph>
                </Flex>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" gap="var(--space-8)">
                <Chip text={person.chip.text} color={person.chip.color} variant="surface" size="sm" />
                <Button variant="borderless" color="blue" size="sm">
                  Message
                </Button>
              </Flex>
            </Flex>
          </Card>
        </div>
      ))}
    </Flex>
  );
}
