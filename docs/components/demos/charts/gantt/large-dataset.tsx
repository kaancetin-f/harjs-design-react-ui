"use client";

import { useMemo } from "react";
import { Gantt } from "@/lib/ui";
import { createLargeDataset, productionResources } from "./data";

export function GanttLargeDataset() {
  const tasks = useMemo(() => createLargeDataset(1000), []);

  return (
    <Gantt
      title="Large dataset"
      description="1000 operations · row + timeline virtualization"
      data={tasks}
      resources={productionResources}
      viewMode="resource"
      defaultZoom="week"
      density="compact"
      showDependencies={false}
      showPlanned={false}
      showActual={false}
      config={{ locale: "en" }}
      pagination={{ totalRecords: 1000, perPage: 100 }}
    />
  );
}
