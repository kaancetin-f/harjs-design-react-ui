'use client';

import { useState } from 'react';
import { Upload, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

function createFile(name: string, type: string, size = 2048) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}

export function UploadDisabled() {
  const [emptyFiles, setEmptyFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>(() => [
    createFile('locked.pdf', 'application/pdf', 18_432),
    createFile('photo.png', 'image/png', 32_768),
  ]);

  return (
    <Flex flexDirection="column" gap="var(--space-24)" width="100%">
      <Upload
        text="Upload files"
        disabled
        files={emptyFiles}
        onChange={(_formData, nextFiles) => setEmptyFiles(nextFiles)}
      />
      <Upload
        text="Upload files"
        multiple
        disabled
        files={files}
        onChange={(_formData, nextFiles) => setFiles(nextFiles)}
      />
    </Flex>
  );
}
