"use client";

import { useState } from "react";
import { Card, Diagram, DnD } from "@/lib/ui";
import { accent, NodeCard } from "./graph";

type Step = { id: string; title: string; hint: string };

const initial: Step[] = [
  { id: "collect", title: "Collect", hint: "Requirements" },
  { id: "review", title: "Review", hint: "Design + API" },
  { id: "ship", title: "Ship", hint: "Release" },
];

export function DiagramWithDnD() {
  const [steps, setSteps] = useState(initial);

  const nodes = steps.map((step, index) => ({
    id: step.id,
    position: { x: 28 + index * 200, y: 48 },
    data: <NodeCard title={step.title} hint={step.hint} />,
  }));

  const edges = steps.slice(0, -1).map((step, index) => ({
    id: `e-${step.id}-${steps[index + 1].id}`,
    from: { id: step.id, port: "right" as const },
    to: { id: steps[index + 1].id, port: "left" as const },
  }));

  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-16)",
        width: "100%",
        height: "25rem",
      }}
    >
      <div
        style={{
          position: "relative",
          isolation: "isolate",
          zIndex: 0,
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          borderRadius: "var(--radius-12)",
        }}
      >
        <Diagram nodes={nodes} edges={edges} config={{ locale: "en", color: accent }} />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "14.5rem",
          flexShrink: 0,
          height: "100%",
          minHeight: 0,
          overflow: "auto",
        }}
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <Card title="Order" variant="outlined" color="gray-500" border={{ radius: "12" }}>
          <DnD
            data={steps}
            itemKey={(item) => item.id}
            onChange={setSteps}
            renderItem={(item, index) => (
              <Card title={`${index + 1}. ${item.title}`} variant="surface" color="gray-500" border={{ radius: "8" }}>
                {item.hint}
              </Card>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
