'use client';

import { LayoutDemoFrame, LayoutShell } from '@/components/demos/layout/layout/shell';

export function LayoutCollapsed() {
  return (
    <LayoutDemoFrame>
      <LayoutShell defaultCollapsed siderWidth={260} collapsedWidth={72} />
    </LayoutDemoFrame>
  );
}
