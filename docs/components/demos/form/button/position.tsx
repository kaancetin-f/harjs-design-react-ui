'use client';

import { Button } from '@/lib/ui';

export function ButtonPosition() {
  return (
    <div className="preview-position">
      <Button
        color="blue"
        size="sm"
        position={{ type: 'absolute', inset: ['top', 'left'] }}
      >
        top left
      </Button>
      <Button
        color="teal"
        size="sm"
        position={{ type: 'absolute', inset: ['top', 'right'] }}
      >
        top right
      </Button>
      <Button
        color="orange"
        size="sm"
        position={{ type: 'absolute', inset: ['bottom', 'left'] }}
      >
        bottom left
      </Button>
      <Button
        color="purple"
        size="sm"
        position={{ type: 'absolute', inset: ['bottom', 'right'] }}
      >
        bottom right
      </Button>
      <span className="preview-position-hint">relative container</span>
    </div>
  );
}
