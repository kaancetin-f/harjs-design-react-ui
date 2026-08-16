"use client";

import { Alert, Button, Chip, GridSystem, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Title, Paragraph } = Typography;

export function HeroShowcase() {
  return (
    <div className="hero-stage" aria-hidden inert>
      <div className="hero-stage-glow" />
      <div className="hero-stage-card hero-stage-card-back">
        <Flex flexDirection="column" gap="var(--space-12)">
          <Title size="sm">Pipeline</Title>
          <Paragraph size="sm" color="gray-500">
            4 checks green. Coverage 94%.
          </Paragraph>
          <Flex gap="var(--space-8)">
            <Chip text="CI" color="green" variant="filled" border={{ radius: "full" }} size="sm" />
            <Chip text="Lint" color="teal" variant="surface" border={{ radius: "full" }} size="sm" />
          </Flex>
        </Flex>
      </div>
      <div className="hero-stage-card hero-stage-panel">
        <div className="hero-stage-bar">
          <span className="hero-stage-dots" />
          <span>aurora.harjs.design</span>
        </div>
        <Flex flexDirection="column" gap="var(--space-16)">
          <Alert status="information" message="Aurora is live. The production slot is yours." />
          <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
            <Chip text="Design" color="orange" variant="filled" border={{ radius: "full" }} size="sm" />
            <Chip text="API" color="blue" variant="outlined" border={{ radius: "full" }} size="sm" />
            <Chip text="Docs" color="purple" variant="outlined" border={{ radius: "full" }} size="sm" />
          </Flex>
          <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
            <Button color="orange">Publish</Button>
            <Button variant="outlined" color="orange">
              Draft
            </Button>
            <Button variant="borderless" color="gray">
              Cancel
            </Button>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}

HeroShowcase.displayName = "HeroShowcase";
