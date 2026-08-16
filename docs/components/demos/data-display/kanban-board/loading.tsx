"use client";

import { GridSystem, KanbanBoard } from "@/lib/ui";

const { Flex } = GridSystem;

export function KanbanBoardLoading() {
  const columns = [
    {
      key: "todo",
      title: "To do",
      description: "Ready to pick up",
      titleColor: "#3b82f6",
      items: [],
      columnProperties: { status: "todo" },
      renderItem: () => <span />,
    },
    {
      key: "doing",
      title: "In progress",
      description: "Actively moving",
      titleColor: "#f59e0b",
      items: [],
      columnProperties: { status: "doing" },
      renderItem: () => <span />,
    },
    {
      key: "done",
      title: "Done",
      description: "Shipped this week",
      titleColor: "#22c55e",
      items: [],
      columnProperties: { status: "done" },
      renderItem: () => <span />,
    },
  ];

  return (
    <Flex flexDirection="column" width="100%" height="22rem">
      <KanbanBoard trackBy={() => "id"} columns={columns} loading config={{ locale: "en" }} />
    </Flex>
  );
}
