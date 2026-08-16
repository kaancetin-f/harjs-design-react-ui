'use client';

import { Radio, GridSystem } from '@/lib/ui';

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
] as const;

export function RadioColors() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {colors.map((color) => (
        <div key={color} className="preview-color-row">
          <span className="preview-color-label">{color}</span>
          <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
            {variants.map((variant) => (
              <Radio
                key={variant}
                label="Radio"
                color={color}
                variant={variant}
                defaultChecked
              />
            ))}
          </Flex>
        </div>
      ))}
    </Flex>
  );
}
