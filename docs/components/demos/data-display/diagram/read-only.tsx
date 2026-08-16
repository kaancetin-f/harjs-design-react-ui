'use client';

import { Diagram } from '@/lib/ui';
import { accent, createPipeline, DiagramFrame } from './graph';

export function DiagramReadOnly() {
  const { nodes, edges } = createPipeline();

  return (
    <DiagramFrame>
      <Diagram
        nodes={nodes}
        edges={edges}
        config={{ locale: 'en', color: accent, readOnly: true }}
      />
    </DiagramFrame>
  );
}
