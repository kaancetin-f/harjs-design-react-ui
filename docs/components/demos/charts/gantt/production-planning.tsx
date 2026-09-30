"use client";

import { useState } from "react";
import { Gantt } from "@/lib/ui";
import { productionDependencies, productionTasks } from "./data";
import type { Task } from "./data";

export function GanttProductionPlanning() {
  const [tasks, setTasks] = useState<Task[]>(productionTasks);

  return (
    <Gantt
      title="Production planning"
      description="PO → operations with planned vs actual"
      data={tasks}
      dependencies={productionDependencies}
      defaultZoom="day"
      showCriticalPath
      showPlanned
      showActual
      showProgress
      density="comfortable"
      calendar={{
        workingDays: [1, 2, 3, 4, 5],
        shifts: [{ start: "08:00", end: "17:00" }],
        holidays: ["2026-10-29"],
      }}
      columns={[
        { key: "name", title: "Order / Operation", width: 220 },
        { key: "status", title: "Status", width: 110 },
        { key: "progress", title: "Progress", width: 96, align: "right" },
      ]}
      config={{ locale: "en" }}
      onTaskChange={({ task }) => {
        setTasks((prev) => prev.map((item) => (String(item.id) === String(task.id) ? task : item)));
      }}
    />
  );
}
