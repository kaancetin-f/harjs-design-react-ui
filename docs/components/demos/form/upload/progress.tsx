'use client';

import { useState } from 'react';
import { Upload } from '@/lib/ui';

function createFile(name: string, type: string, size = 2048) {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}

export function UploadProgress() {
  const [files, setFiles] = useState<File[]>(() => [
    createFile('q3-brief.pdf', 'application/pdf', 184_320),
    createFile('brand.png', 'image/png', 48_128),
    createFile('invoice-fail.pdf', 'application/pdf', 22_016),
  ]);

  return (
    <Upload
      text="Upload files"
      multiple
      files={files}
      onChange={(_formData, nextFiles) => setFiles(nextFiles)}
      onRequest={({ file, onProgress, onSuccess, onError }) => {
        let percent = 0;
        const timer = window.setInterval(() => {
          percent += 8;

          if (file.name.includes('fail') && percent >= 40) {
            window.clearInterval(timer);
            onError(new Error('Upload failed'));
            return;
          }

          onProgress(percent);

          if (percent >= 100) {
            window.clearInterval(timer);
            onSuccess();
          }
        }, 160);
      }}
    />
  );
}
