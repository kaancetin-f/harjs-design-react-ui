import { useId } from "react";

const FLAME = [
  "........#......#.#.",
  ".......#.#.#...###.",
  "........##.....#.#.",
  "........##.........",
  ".......###.........",
  "......####.........",
  "......#####........",
  ".#.#..######...#.#.",
  "..#...######.......",
  ".#.#...######..#.#.",
  "...##..######..#...",
  "...##.######..###..",
  "..###########.###..",
  "..#######.#######..",
  ".#######..########.",
  "#######....########",
  ".#####......######.",
  ".#####.##....#####.",
  ".####..#......####.",
  "..###.##...#..###..",
  "..###.#....#..###..",
  "...###.......###...",
  "....###.....###....",
  ".....###...###.....",
];

const COLS = 19;
const ROWS = FLAME.length;
const GAP = 8;
const RADIUS = 3.15;
const PAD = 8;
const WIDTH = PAD * 2 + (COLS - 1) * GAP;
const HEIGHT = PAD * 2 + (ROWS - 1) * GAP;

function isLit(c: number, r: number) {
  return FLAME[r]?.[c] === "#";
}

function neighborCount(c: number, r: number) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      if (isLit(c + dx, r + dy)) count += 1;
    }
  }
  return count;
}

function dotKind(c: number, r: number) {
  const neighbors = neighborCount(c, r);
  if (neighbors <= 2) return "ember";
  if (r < 8) return "tip";
  return "core";
}

export function LogoMark({ size = 28 }: { size?: number }) {
  // hooks
  const uid = useId().replace(/:/g, "");

  // variables
  const gradientId = `flame-${uid}`;
  const width = Math.round((size * WIDTH) / HEIGHT);

  return (
    <svg
      className="docs-logo-mark"
      width={width}
      height={size}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop className="docs-logo-stop-tip" offset="0%" stopColor="var(--logo-tip)" />
          <stop className="docs-logo-stop-mid" offset="42%" stopColor="var(--logo-mid)" />
          <stop offset="100%" stopColor="var(--logo-base)" />
        </linearGradient>
      </defs>
      {FLAME.flatMap((row, r) =>
        [...row].flatMap((cell, c) => {
          if (cell !== "#") return [];
          const delay = ((c * 13 + r * 7) % 24) / 12;
          return [
            <circle
              key={`${c}-${r}`}
              className={`docs-logo-dot docs-logo-dot-${dotKind(c, r)}`}
              cx={PAD + c * GAP}
              cy={PAD + r * GAP}
              r={RADIUS}
              fill={`url(#${gradientId})`}
              style={{ animationDelay: `${delay}s` }}
            />,
          ];
        }),
      )}
    </svg>
  );
}

LogoMark.displayName = "LogoMark";
