import { type ReactNode } from 'react';
import { Card, type EdgeData, type NodeData } from '@/lib/ui';

export const accent = 'var(--blue-500)';

export function NodeCard({ title, hint }: { title: string; hint: string }) {
  return (
    <Card title={title} variant="outlined" color="gray-500" border={{ radius: '12' }}>
      {hint}
    </Card>
  );
}

export function createPipeline(): { nodes: NodeData[]; edges: EdgeData[] } {
  return {
    nodes: [
      {
        id: 'start',
        position: { x: 36, y: 72 },
        data: <NodeCard title="Collect" hint="Requirements" />,
      },
      {
        id: 'review',
        position: { x: 236, y: 72 },
        data: <NodeCard title="Review" hint="Design + API" />,
      },
      {
        id: 'done',
        position: { x: 436, y: 72 },
        data: <NodeCard title="Ship" hint="Release" />,
      },
    ],
    edges: [
      {
        id: 'e1',
        from: { id: 'start', port: 'right' },
        to: { id: 'review', port: 'left' },
      },
      {
        id: 'e2',
        from: { id: 'review', port: 'right' },
        to: { id: 'done', port: 'left' },
      },
    ],
  };
}

export function DiagramFrame({
  children,
  height = '26rem',
}: {
  children: ReactNode;
  height?: string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        borderRadius: 'var(--radius-12)',
      }}
    >
      {children}
    </div>
  );
}
