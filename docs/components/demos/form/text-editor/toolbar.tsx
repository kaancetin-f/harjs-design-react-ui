'use client';

import { useState } from 'react';
import { TextEditor } from '@/lib/ui';

export function TextEditorToolbar() {
  const [value, setValue] = useState('<p>Notes without formatting tools.</p>');

  return (
    <TextEditor
      placeholder="Notes"
      height={160}
      toolbar={false}
      value={value}
      onChange={(next) => setValue(next ?? '')}
    />
  );
}
