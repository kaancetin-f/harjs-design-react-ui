'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

function createFile(name: string, type: string, size = 2048) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}

export function UploadGrid() {
  const [files, setFiles] = useState<File[]>(() => [
    createFile('hero.png', 'image/png', 48_128),
    createFile('invoice.pdf', 'application/pdf', 22_016),
    createFile('logo.svg', 'image/svg+xml', 1_280),
    createFile('archive.zip', 'application/zip', 512_000),
  ]);

  return (
    <Upload
      type="grid"
      text="Upload files"
      multiple
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
    />
  );
}
