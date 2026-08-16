import { type ReactNode } from 'react';

export function GridCell({ children, fit }: { children: ReactNode; fit?: boolean }) {
  return <span className={['docs-grid-cell', fit ? 'is-fit' : undefined].filter(Boolean).join(' ')}>{children}</span>;
}
