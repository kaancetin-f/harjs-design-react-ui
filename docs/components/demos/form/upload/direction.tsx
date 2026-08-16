'use client';

import { useState } from 'react';
import { Upload, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

function createFile(name: string, type: string, size = 2048) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}

const sampleFiles = () => [
  createFile('cover.png', 'image/png', 32_768),
  createFile('spec.pdf', 'application/pdf', 18_432),
];

export function UploadDirection() {
  const [columnFiles, setColumnFiles] = useState<File[]>(sampleFiles);
  const [rowFiles, setRowFiles] = useState<File[]>(sampleFiles);

  return (
    <Flex flexDirection="column" gap="var(--space-24)" width="100%">
      <Upload
        text="Column"
        multiple
        direction="column"
        files={columnFiles}
        onChange={(_formData, nextFiles) => setColumnFiles(nextFiles)}
      />
      <Upload
        text="Row"
        multiple
        direction="row"
        files={rowFiles}
        onChange={(_formData, nextFiles) => setRowFiles(nextFiles)}
      />
    </Flex>
  );
}
