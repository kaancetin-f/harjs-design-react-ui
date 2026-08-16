'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

function createImage(name: string, fill: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="100%" height="100%" fill="${fill}"/><text x="50%" y="50%" fill="white" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="28">${name}</text></svg>`;

  return new File([svg], name, { type: 'image/svg+xml', lastModified: 1 });
}

export function UploadDropzoneFiles() {
  const [files, setFiles] = useState<File[]>(() => [
    createImage('hero.svg', '#2563eb'),
    createImage('poster.svg', '#7c3aed'),
    createImage('banner.svg', '#0f766e'),
  ]);

  return (
    <Upload
      type="dropzone"
      text="Drop images here or click to browse"
      multiple
      allowedTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
    />
  );
}
