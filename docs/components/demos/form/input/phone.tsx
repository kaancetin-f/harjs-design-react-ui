'use client';

import { useState } from 'react';
import { Input } from '@/lib/ui';

const options = [
  { value: '+90', text: 'TR +90' },
  { value: '+1', text: 'US +1' },
  { value: '+44', text: 'UK +44' },
  { value: '+49', text: 'DE +49' },
];

export function InputPhone() {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('+90');

  return (
    <Input.Phone
      placeholder="Phone"
      options={options}
      values={{ option: country, value: phone }}
      onSelected={(option) => setCountry(String(option?.value ?? '+90'))}
      onChange={(e) => setPhone(e.target.value)}
    />
  );
}
