'use client';

import { Alert } from '@/lib/ui';

export function AlertLists() {
  return (
    <Alert
      status="danger"
      message={[
        'Fix these fields before publishing.',
        ['Title must be unique.', 'Slug is already taken.'],
        'Cover image is missing.',
        ['Use 1600×900 or larger.', 'Keep the file under 1.5 MB.'],
      ]}
    />
  );
}
