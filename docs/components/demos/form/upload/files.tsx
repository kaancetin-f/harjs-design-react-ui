'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

function createFile(name: string, type: string, size = 2048) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}

export function UploadFiles() {
  const [files, setFiles] = useState<File[]>(() => [
    createFile('q3-brief.pdf', 'application/pdf', 184_320),
    createFile('brand-guidelines.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 96_256),
    createFile('notes.txt', 'text/plain', 420),
  ]);

  return (
    <Upload
      text="Upload files"
      multiple
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
    />
  );
}
