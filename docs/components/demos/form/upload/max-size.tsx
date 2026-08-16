'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

function createFile(name: string, type: string, size = 2048) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}

export function UploadMaxSize() {
  const [files, setFiles] = useState<File[]>(() => [
    createFile('avatar.png', 'image/png', 48_128),
    createFile('huge-photo.png', 'image/png', Math.ceil(1.2 * 1024 * 1024)),
  ]);

  return (
    <Upload
      text="Images up to 1MB"
      multiple
      allowedTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
      maxSize={1}
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
    />
  );
}
