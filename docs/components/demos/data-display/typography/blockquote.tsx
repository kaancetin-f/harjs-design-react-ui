"use client";

import { Typography } from "@/lib/ui";

const { Blockquote } = Typography;

export function TypographyBlockquote() {
  return (
    <Blockquote cite="Ada Lovelace">
      The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.
    </Blockquote>
  );
}
