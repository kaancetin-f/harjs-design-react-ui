"use client";

import { useState } from "react";
import { Button, GridSystem, Input, Pagination, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PaginationPlayground() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(250);

  return (
    <Flex flexDirection="column" gap="var(--space-16)">
      <Flex gap="var(--space-8)" flexWrap="wrap">
        <Button
          variant="outlined"
          color="gray"
          size="sm"
          onClick={() => setTotal(10)}
        >
          10 records
        </Button>
        <Button
          variant="outlined"
          color="gray"
          size="sm"
          onClick={() => setTotal(100)}
        >
          100 records
        </Button>
        <Button
          variant="outlined"
          color="gray"
          size="sm"
          onClick={() => setTotal(1000)}
        >
          1000 records
        </Button>
      </Flex>
      <Input
        type="number"
        size="sm"
        value={String(total)}
        onChange={(event) => {
          const next = Number(event.target.value);
          setTotal(Number.isFinite(next) && next >= 0 ? next : 0);
          setPage(1);
        }}
      />
      <Pagination
        currentPage={page}
        totalRecords={total}
        perPage={size}
        locale="en"
        showQuickJumper
        onChange={(nextPage, nextSize) => {
          setPage(nextPage);
          setSize(nextSize);
        }}
      />
      <Paragraph size="sm" color="gray-600">
        Page {page} · {size} per page · {total} records
      </Paragraph>
    </Flex>
  );
}
