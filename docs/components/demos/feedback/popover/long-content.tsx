"use client";

import { Button, GridSystem, Popover, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const notes = [
  "Coverage is 94% and the bundle is in budget.",
  "Staging is two commits behind main.",
  "The changelog still needs the migration note.",
  "QA wants a pass on the empty states before we promote.",
  "Docs should mention the new Spinner in the feedback section.",
];

export function PopoverLongContent() {
  return (
    <Popover
      title="Review notes"
      content={
        <Flex flexDirection="column" gap="var(--space-8)">
          {notes.map((note) => (
            <Paragraph key={note} size="sm">
              {note}
            </Paragraph>
          ))}
        </Flex>
      }
    >
      <Button variant="outlined" color="orange">
        Open notes
      </Button>
    </Popover>
  );
}
