"use client";

import { GridSystem, Typography } from "@/lib/ui";
import { PaginationDemo } from "./basic";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PaginationKeyboard() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <PaginationDemo totalRecords={180} perPage={10} currentPage={4} />
      <Paragraph size="sm" color="gray-600">
        Tab moves through page size, then first, previous, page numbers, next, and last. Enter or Space activates a
        control. The current page uses `aria-current="page"`. Disabled first/previous/next/last are skipped.
      </Paragraph>
    </Flex>
  );
}
