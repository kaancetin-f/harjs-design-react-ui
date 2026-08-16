'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const colors = [
  'gray',
  'white',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
] as const;

const variants = [
  'filled',
  'surface',
  'surface-borderless',
  'outlined',
  'dashed',
  'borderless',
] as const;

export function ButtonColors() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {colors.map((color) => (
        <div key={color} className="preview-color-row">
          <span className="preview-color-label">{color}</span>
          <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
            {variants.map((variant) => (
              <Button key={variant} color={color} variant={variant}>
                Button
              </Button>
            ))}
          </Flex>
        </div>
      ))}
    </Flex>
  );
}
