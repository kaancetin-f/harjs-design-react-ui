"use client";

import { useState } from "react";
import { Pagination } from "@/lib/ui";

export function PaginationDemo({
  totalRecords = 95,
  perPage = 10,
  currentPage = 1,
  showTotal,
  showQuickJumper,
  loading,
}: {
  totalRecords?: number;
  perPage?: number;
  currentPage?: number;
  showTotal?: boolean;
  showQuickJumper?: boolean;
  loading?: boolean;
}) {
  const [page, setPage] = useState(currentPage);
  const [size, setSize] = useState(perPage);

  return (
    <Pagination
      currentPage={page}
      totalRecords={totalRecords}
      perPage={size}
      locale="en"
      showTotal={showTotal}
      showQuickJumper={showQuickJumper}
      loading={loading}
      onChange={(nextPage, nextSize) => {
        setPage(nextPage);
        setSize(nextSize);
      }}
    />
  );
}

export function PaginationBasic() {
  return <PaginationDemo totalRecords={95} perPage={10} />;
}
