'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

export function UploadBasic() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Upload
      text="Upload files"
      multiple
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
    />
  );
}
