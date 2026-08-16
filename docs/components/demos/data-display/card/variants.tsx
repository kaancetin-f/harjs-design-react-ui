"use client";

import { Card, Chip, GridSystem, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const variants = [
  {
    variant: "outlined",
    title: "Outlined",
    body: "Default surface. White background, soft border, and a light shadow.",
  },
  {
    variant: "surface",
    title: "Surface",
    body: "Tinted fill with a matching border. Use for a quieter accent.",
  },
  {
    variant: "surface-borderless",
    title: "Surface borderless",
    body: "Same tint, no border. Sits flush on grouped layouts.",
  },
  {
    variant: "filled",
    title: "Filled",
    body: "Solid color for a primary highlight or hero tile.",
  },
] as const;

export function CardVariants() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
      {variants.map((item) => (
        <div key={item.variant} style={{ flex: "1 1 16rem", minWidth: 0 }}>
          <Card title={item.title} variant={item.variant} color="blue">
            <Flex flexDirection="column" gap="var(--space-12)">
              <Paragraph color={item.variant === "filled" ? "var(--white-alpha-80)" : undefined}>{item.body}</Paragraph>
            </Flex>
          </Card>
        </div>
      ))}
    </Flex>
  );
}
