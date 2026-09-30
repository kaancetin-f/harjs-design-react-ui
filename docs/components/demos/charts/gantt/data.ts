import type { GanttTask } from "@/lib/ui";

export type Task = GanttTask;

export type GanttDependency = {
  id?: string | number;
  fromId: string | number;
  toId: string | number;
  type?: "FS" | "SS" | "FF" | "SF";
  lagMs?: number;
};

export type GanttResource = {
  id: string | number;
  name: string;
  parentId?: string | number;
  type?: string;
  code?: string;
};

export const productionResources: GanttResource[] = [
  { id: "plant-a", name: "Plant A", type: "plant" },
  { id: "wc-01", name: "Work Center 01", parentId: "plant-a", type: "work-center", code: "WC-01" },
  { id: "cnc-01", name: "CNC-01", parentId: "wc-01", type: "machine", code: "CNC-01" },
  { id: "cnc-02", name: "CNC-02", parentId: "wc-01", type: "machine", code: "CNC-02" },
  { id: "wc-02", name: "Work Center 02", parentId: "plant-a", type: "work-center", code: "WC-02" },
  { id: "press-01", name: "PRESS-01", parentId: "wc-02", type: "machine", code: "PRESS-01" },
  { id: "plant-b", name: "Plant B", type: "plant" },
  { id: "assembly", name: "Assembly", parentId: "plant-b", type: "work-center", code: "ASM" },
  { id: "asm-01", name: "ASM-01", parentId: "assembly", type: "machine", code: "ASM-01" },
];

export const productionTasks: Task[] = [
  {
    id: "po-001",
    code: "PO-2026-001",
    name: "Shaft Assembly",
    type: "production-order",
    start: "2026-09-28T08:00:00",
    end: "2026-10-08T17:00:00",
    status: "in-progress",
    progress: 55,
    priority: 1,
  },
  {
    id: "op-010",
    parentId: "po-001",
    code: "OP-010",
    name: "Cutting",
    type: "operation",
    start: "2026-09-28T08:00:00",
    end: "2026-09-29T12:00:00",
    plannedStart: "2026-09-28T08:00:00",
    plannedEnd: "2026-09-29T12:00:00",
    actualStart: "2026-09-28T08:15:00",
    actualEnd: "2026-09-29T11:40:00",
    status: "completed",
    progress: 100,
    resourceId: "press-01",
    quantity: 200,
    completedQuantity: 200,
  },
  {
    id: "op-020",
    parentId: "po-001",
    code: "OP-020",
    name: "CNC Machining",
    type: "operation",
    start: "2026-09-30T08:00:00",
    end: "2026-10-02T16:00:00",
    plannedStart: "2026-09-29T13:00:00",
    plannedEnd: "2026-10-01T16:00:00",
    actualStart: "2026-09-30T08:25:00",
    status: "delayed",
    progress: 62,
    resourceId: "cnc-01",
    critical: true,
    quantity: 200,
    completedQuantity: 124,
  },
  {
    id: "op-025",
    parentId: "po-001",
    code: "OP-025",
    name: "Setup / Changeover",
    type: "setup",
    start: "2026-09-30T06:30:00",
    end: "2026-09-30T08:00:00",
    status: "completed",
    progress: 100,
    resourceId: "cnc-01",
  },
  {
    id: "op-030",
    parentId: "po-001",
    code: "OP-030",
    name: "Welding",
    type: "operation",
    start: "2026-10-03T08:00:00",
    end: "2026-10-05T12:00:00",
    plannedStart: "2026-10-02T08:00:00",
    plannedEnd: "2026-10-04T12:00:00",
    status: "planned",
    progress: 0,
    resourceId: "cnc-02",
    critical: true,
  },
  {
    id: "op-040",
    parentId: "po-001",
    code: "OP-040",
    name: "Painting",
    type: "operation",
    start: "2026-10-06T08:00:00",
    end: "2026-10-07T12:00:00",
    status: "planned",
    progress: 0,
    resourceId: "press-01",
  },
  {
    id: "op-050",
    parentId: "po-001",
    code: "OP-050",
    name: "Assembly",
    type: "operation",
    start: "2026-10-07T13:00:00",
    end: "2026-10-08T17:00:00",
    status: "planned",
    progress: 0,
    resourceId: "asm-01",
  },
  {
    id: "ms-final",
    parentId: "po-001",
    code: "MS-01",
    name: "Final Inspection",
    type: "milestone",
    start: "2026-10-08T17:00:00",
    end: "2026-10-08T17:00:00",
    status: "planned",
  },
  {
    id: "po-002",
    code: "PO-2026-002",
    name: "Housing Bracket",
    type: "production-order",
    start: "2026-09-29T08:00:00",
    end: "2026-10-06T17:00:00",
    status: "released",
    progress: 20,
    priority: 2,
  },
  {
    id: "op-110",
    parentId: "po-002",
    code: "OP-110",
    name: "Laser Cut",
    type: "operation",
    start: "2026-09-29T08:00:00",
    end: "2026-09-30T12:00:00",
    status: "in-progress",
    progress: 70,
    resourceId: "press-01",
  },
  {
    id: "op-120",
    parentId: "po-002",
    code: "OP-120",
    name: "CNC Finish",
    type: "operation",
    start: "2026-10-01T08:00:00",
    end: "2026-10-03T16:00:00",
    status: "planned",
    progress: 0,
    resourceId: "cnc-02",
  },
  {
    id: "dt-01",
    code: "DT-01",
    name: "CNC-01 Downtime",
    type: "downtime",
    start: "2026-10-02T12:00:00",
    end: "2026-10-02T14:00:00",
    status: "paused",
    resourceId: "cnc-01",
    color: "var(--gray-500)",
  },
];

export const productionDependencies: GanttDependency[] = [
  { id: "d1", fromId: "op-010", toId: "op-020", type: "FS" },
  { id: "d2", fromId: "op-020", toId: "op-030", type: "FS" },
  { id: "d3", fromId: "op-030", toId: "op-040", type: "FS" },
  { id: "d4", fromId: "op-040", toId: "op-050", type: "FS" },
  { id: "d5", fromId: "op-050", toId: "ms-final", type: "FS" },
  { id: "d6", fromId: "op-110", toId: "op-120", type: "FS" },
];

export const basicTasks: Task[] = [
  { id: 1, name: "Design", start: "2026-09-28", end: "2026-09-30", status: "completed", progress: 100 },
  { id: 2, name: "Prototype", start: "2026-10-01", end: "2026-10-04", status: "in-progress", progress: 45 },
  { id: 3, name: "Validation", start: "2026-10-05", end: "2026-10-08", status: "planned", progress: 0 },
];

export const createLargeDataset = (count = 1000): Task[] => {
  const startBase = new Date(2026, 8, 1).getTime();
  return Array.from({ length: count }, (_, i) => {
    const dayOffset = i % 60;
    const durationDays = 1 + (i % 5);
    const start = new Date(startBase + dayOffset * 86_400_000);
    const end = new Date(start.getTime() + durationDays * 86_400_000);
    return {
      id: `task-${i}`,
      name: `Operation ${i + 1}`,
      code: `OP-${String(i + 1).padStart(4, "0")}`,
      type: "operation" as const,
      start: start.toISOString(),
      end: end.toISOString(),
      status: (["planned", "in-progress", "completed", "delayed"] as const)[i % 4],
      progress: (i * 17) % 100,
      resourceId: ["cnc-01", "cnc-02", "press-01", "asm-01"][i % 4],
    };
  });
};
