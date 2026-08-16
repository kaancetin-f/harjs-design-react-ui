"use client";

import { Typography } from "@/lib/ui";

const { Code } = Typography;

const SAMPLE = `import { Button } from "@harjs/react-ui";

export function App() {
  return <Button color="blue">Save</Button>;
}`;

export function TypographyCode() {
  return <Code lang="tsx">{SAMPLE}</Code>;
}
