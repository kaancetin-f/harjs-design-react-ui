"use client";

import { useState } from "react";
import { Gantt } from "@/lib/ui";
import { productionDependencies, productionResources, productionTasks } from "./data";
import type { Task } from "./data";

export function GanttResourcePlanning() {
  const [tasks, setTasks] = useState<Task[]>(productionTasks);

  return (
    <Gantt
      title="Machine planning"
      description="Resource hierarchy · plant → work center → machine"
      data={tasks}
      resources={productionResources}
      dependencies={productionDependencies}
      viewMode="resource"
      defaultZoom="day"
      showDependencies
      columns={[
        { key: "name", title: "Resource / Operation", width: 240 },
        { key: "status", title: "Status", width: 90 },
      ]}
      config={{ locale: "en" }}
      onTaskChange={({ task }) => {
        setTasks((prev) => prev.map((item) => (String(item.id) === String(task.id) ? task : item)));
      }}
    />
  );
}
