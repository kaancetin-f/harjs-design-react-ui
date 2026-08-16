'use client';

import { useState } from 'react';
import { Diagram } from '@/lib/ui';
import { accent, createPipeline, DiagramFrame } from './graph';

export function DiagramDisconnect() {
  const [graph, setGraph] = useState(createPipeline);

  return (
    <DiagramFrame>
      <Diagram
        nodes={graph.nodes}
        edges={graph.edges}
        onNodesChange={(nodes) => setGraph((prev) => ({ ...prev, nodes }))}
        onEdgesChange={(edges) => setGraph((prev) => ({ ...prev, edges }))}
        config={{
          locale: 'en',
          color: accent,
          connectable: false,
          creatable: false,
          reconnectable: true,
          disconnectable: true,
        }}
      />
    </DiagramFrame>
  );
}
