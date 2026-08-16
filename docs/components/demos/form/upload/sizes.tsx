'use client';

import { useState } from 'react';
import { Upload, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function UploadSizes() {
  const [smFiles, setSmFiles] = useState<File[]>([]);
  const [mdFiles, setMdFiles] = useState<File[]>([]);
  const [lgFiles, setLgFiles] = useState<File[]>([]);

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Upload
        text="Small"
        size="sm"
        files={smFiles}
        onChange={(_formData, nextFiles) => setSmFiles(nextFiles)}
      />
      <Upload
        text="Medium"
        size="md"
        files={mdFiles}
        onChange={(_formData, nextFiles) => setMdFiles(nextFiles)}
      />
      <Upload
        text="Large"
        size="lg"
        files={lgFiles}
        onChange={(_formData, nextFiles) => setLgFiles(nextFiles)}
      />
    </Flex>
  );
}
