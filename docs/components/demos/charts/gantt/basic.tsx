"use client";

import { useState } from "react";
import { Gantt } from "@/lib/ui";
import { basicTasks } from "./data";
import type { Task } from "./data";

export function GanttBasic() {
  const [tasks, setTasks] = useState<Task[]>(basicTasks);

  return (
    <Gantt
      title="Project timeline"
      description="Basic schedule view"
      data={tasks}
      defaultZoom="day"
      config={{ locale: "en" }}
      onTaskChange={({ task }) => {
        setTasks((prev) => prev.map((item) => (String(item.id) === String(task.id) ? task : item)));
      }}
    />
  );
}
