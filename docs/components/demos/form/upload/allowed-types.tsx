'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

function createFile(name: string, type: string, size = 2048) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}

function createImage(name: string, fill: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="100%" height="100%" fill="${fill}"/></svg>`;

  return new File([svg], name, { type: 'image/svg+xml', lastModified: 1 });
}

export function UploadAllowedTypes() {
  const [files, setFiles] = useState<File[]>(() => [
    createImage('hero.svg', '#2563eb'),
    createFile('notes.txt', 'text/plain', 420),
    createFile('brief.pdf', 'application/pdf', 18_432),
  ]);

  return (
    <Upload
      text="Images only"
      multiple
      allowedTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
    />
  );
}
