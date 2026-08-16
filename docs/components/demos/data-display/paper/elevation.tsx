"use client";

import { GridSystem, Paper, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const elevations = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24] as const;

export function PaperElevation() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
      {elevations.map((elevation) => (
        <div key={elevation} style={{ flex: "1 1 10.5rem", minWidth: 0 }}>
          <Paper title={`Elevation ${elevation}`} elevation={elevation}>
            <Paragraph>Shadow level {elevation}.</Paragraph>
          </Paper>
        </div>
      ))}
    </Flex>
  );
}
