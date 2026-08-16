'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ButtonLoading() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Button color="blue" loading>
        Saving
      </Button>
      <Button variant="outlined" color="blue" loading>
        Saving
      </Button>
      <Button variant="borderless" color="blue" loading>
        Saving
      </Button>
      <Button
        color="blue"
        loading
        icon={{ element: <ArrowIcon />, position: 'start' }}
      >
        Continue
      </Button>
      <Button shape="circle" color="blue" loading />
    </Flex>
  );
}

export function ButtonLoadingSpinner() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Button color="teal" loading spinner={<DotsSpinner />}>
        Uploading
      </Button>
      <Button variant="outlined" color="teal" loading spinner={<DotsSpinner />}>
        Uploading
      </Button>
      <Button shape="square" color="teal" loading spinner={<DotsSpinner />} />
    </Flex>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotsSpinner() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="3" cy="8" r="1.6">
        <animate
          attributeName="opacity"
          values="0.25;1;0.25"
          dur="0.8s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="8" cy="8" r="1.6">
        <animate
          attributeName="opacity"
          values="0.25;1;0.25"
          dur="0.8s"
          begin="0.15s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="13" cy="8" r="1.6">
        <animate
          attributeName="opacity"
          values="0.25;1;0.25"
          dur="0.8s"
          begin="0.3s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
