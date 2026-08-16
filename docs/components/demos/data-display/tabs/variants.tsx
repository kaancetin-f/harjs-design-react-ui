'use client';

import { GridSystem, Tabs } from '@/lib/ui';

const { Flex } = GridSystem;

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,81.86,37.12A8,8,0,0,1,250.14,206.7Z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40ZM216,200H40V88H216Z" />
    </svg>
  );
}

function CheckSquareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z" />
    </svg>
  );
}

export const tabsIconItems = [
  { title: 'Members', icon: { element: <UsersIcon /> }, content: 'People in this workspace.' },
  { title: 'Projects', icon: { element: <FolderIcon /> }, content: 'Active projects and folders.' },
  { title: 'Settings', icon: { element: <CheckSquareIcon /> }, content: 'Workspace preferences.' },
];

const variants = ['underline', 'pill', 'segmented', 'folder', 'minimal'] as const;

export function TabsVariants() {
  return (
    <Flex flexDirection="column" gap="var(--space-24)" width="100%">
      {variants.map((variant) => (
        <Tabs key={variant} name={`docs-tabs-variant-${variant}`} variant={variant} tabs={tabsIconItems} />
      ))}
    </Flex>
  );
}
