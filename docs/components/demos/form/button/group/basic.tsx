'use client';

import { Button } from '@/lib/ui';

export function ButtonGroupBasic() {
  return (
    <Button.Group color="blue" size="md">
      <Button>Left</Button>
      <Button>Center</Button>
      <Button>Right</Button>
    </Button.Group>
  );
}
