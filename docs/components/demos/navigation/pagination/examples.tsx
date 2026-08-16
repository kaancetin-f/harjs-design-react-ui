"use client";

import { GridSystem, Typography } from "@/lib/ui";
import { PaginationDemo } from "./basic";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PaginationPageSize() {
  return (
    <Flex flexDirection="column" gap="var(--space-8)">
      <PaginationDemo totalRecords={80} perPage={5} />
      <Paragraph size="sm" color="gray-600">
        Options are 5, 10, 15, 50, 75, 100, and All. Changing size calls `onChange(1, perPage)`.
      </Paragraph>
    </Flex>
  );
}

export function PaginationCurrent() {
  return <PaginationDemo totalRecords={120} perPage={10} currentPage={7} />;
}

export function PaginationMany() {
  return <PaginationDemo totalRecords={250} perPage={10} currentPage={10} />;
}

export function PaginationLarge() {
  return <PaginationDemo totalRecords={1000} perPage={10} currentPage={12} />;
}

export function PaginationEmpty() {
  return <PaginationDemo totalRecords={0} perPage={10} />;
}

export function PaginationSingle() {
  return <PaginationDemo totalRecords={8} perPage={10} />;
}

export function PaginationResponsive() {
  return (
    <div style={{ maxWidth: "22rem" }}>
      <PaginationDemo totalRecords={400} perPage={10} currentPage={6} />
    </div>
  );
}

export function PaginationTotal() {
  return <PaginationDemo totalRecords={250} perPage={10} currentPage={3} showTotal />;
}

export function PaginationQuickJump() {
  return (
    <PaginationDemo
      totalRecords={1200}
      perPage={10}
      currentPage={37}
      showQuickJumper
    />
  );
}

export function PaginationLoading() {
  return (
    <Flex flexDirection="column" gap="var(--space-8)">
      <PaginationDemo totalRecords={250} perPage={10} currentPage={4} loading />
      <Paragraph size="sm" color="gray-600">
        `loading` disables every control and keeps the layout. The current page stays visible.
      </Paragraph>
    </Flex>
  );
}
