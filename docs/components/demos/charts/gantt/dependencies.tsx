"use client";

import { Gantt } from "@/lib/ui";
import { productionDependencies, productionTasks } from "./data";

export function GanttDependencies() {
  return (
    <Gantt
      title="Operation dependencies"
      description="Finish-to-Start links with arrowheads"
      data={productionTasks}
      dependencies={productionDependencies}
      defaultZoom="day"
      showDependencies
      showCriticalPath
      config={{ locale: "en" }}
    />
  );
}
