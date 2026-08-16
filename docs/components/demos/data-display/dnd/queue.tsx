export const queue = [
  { id: 'collect', title: 'Collect requirements', hint: 'Intake and scope' },
  { id: 'draft', title: 'Draft the API', hint: 'Contracts and types' },
  { id: 'review', title: 'Review the design', hint: 'Copy and layout' },
  { id: 'ship', title: 'Ship the release', hint: 'Notes and rollout' },
];

export function DnDRow({ title, hint }: { title: string; hint: string }) {
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '0.4rem 0.1rem',
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{title}</span>
      <span style={{ fontSize: '0.75rem', opacity: 0.62 }}>{hint}</span>
    </span>
  );
}
