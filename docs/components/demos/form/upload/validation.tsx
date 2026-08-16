'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

export function UploadValidation() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Upload
      text="Upload a document"
      multiple
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
      validation={files.length === 0 ? { text: 'At least one file is required' } : undefined}
    />
  );
}
