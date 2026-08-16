'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

export function UploadDropzone() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Upload
      type="dropzone"
      text="Drop files here or click to browse"
      multiple
      allowedTypes={['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']}
      maxSize={8}
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
    />
  );
}
