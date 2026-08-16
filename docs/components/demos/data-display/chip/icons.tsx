'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ChipIcons() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Chip text="Tagged" color="blue" icon={{ element: <TagIcon /> }} />
      <Chip text="Starred" color="orange" variant="filled" icon={{ element: <StarIcon /> }} />
      <Chip
        text="Shared"
        color="teal"
        variant="surface"
        icon={{ element: <ShareIcon />, position: 'end' }}
      />
    </Flex>
  );
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40A8,8,0,0,0,32,40v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M234.29,114.67l-45.84,37,14.16,58.22a8,8,0,0,1-11.82,8.81L128,185.79,65.21,218.73a8,8,0,0,1-11.82-8.81l14.16-58.22-45.84-37a8,8,0,0,1,4.47-14.07l60.72-5.15,23.49-55.47a8,8,0,0,1,14.62,0l23.49,55.47,60.72,5.15a8,8,0,0,1,4.47,14.07Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63A40,40,0,1,0,136,40a39.87,39.87,0,0,0,6.31.5L96.21,70.13a40,40,0,1,0,0,115.74l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,72a24,24,0,1,1,24-24A24,24,0,0,1,176,224Z" />
    </svg>
  );
}
