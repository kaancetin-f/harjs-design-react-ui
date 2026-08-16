"use client";

import { useState } from "react";
import { Diagram, GridSystem } from "@/lib/ui";
import { accent, createPipeline, DiagramFrame } from "./graph";

const { Flex } = GridSystem;

export function DiagramBasic() {
  const [graph, setGraph] = useState(createPipeline);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <DiagramFrame>
        <Diagram
          nodes={graph.nodes}
          edges={graph.edges}
          onNodesChange={(nodes) => setGraph((prev) => ({ ...prev, nodes }))}
          onEdgesChange={(edges) => setGraph((prev) => ({ ...prev, edges }))}
          onNodeClick={(node) => setSelected(String(node.id))}
          config={{ locale: "en", color: "var(--orange-500)" }}
        />
      </DiagramFrame>
      <span style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
        {selected
          ? `Clicked ${selected}`
          : "Drag ports to connect. Drop on empty canvas to add a node. Grab a wire to reconnect or disconnect."}
      </span>
    </Flex>
  );
}
