"use client";

import { Gantt } from "@/lib/ui";
import { productionTasks } from "./data";

export function GanttPlannedVsActual() {
  return (
    <Gantt
      title="Planned vs actual"
      description="Gray baseline = planned · orange = actual · delayed CNC is highlighted"
      data={productionTasks.filter((t) => t.parentId === "po-001" || t.id === "po-001")}
      defaultZoom="day"
      showPlanned
      showActual
      showProgress
      config={{ locale: "en" }}
    />
  );
}
