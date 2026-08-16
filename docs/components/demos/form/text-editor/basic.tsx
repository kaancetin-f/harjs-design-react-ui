'use client';

import { useState } from 'react';
import { TextEditor } from '@/lib/ui';

export function TextEditorBasic() {
  const [value, setValue] = useState('<p>Hello world</p>');

  return (
    <TextEditor
      placeholder="Write something"
      height={200}
      value={value}
      onChange={(next) => setValue(next ?? '')}
    />
  );
}
