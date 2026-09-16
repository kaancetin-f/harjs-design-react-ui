import { type ReactNode } from "react";
import { type EdgeData, type NodeData } from "@/lib/ui";

export const accent = "var(--pink-500)";

function NodeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 7.5h6M5 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function NodeBox({
  title,
  accent: isAccent = false,
}: {
  title: string;
  accent?: boolean;
}) {
  return (
    <span className={isAccent ? "node-box is-accent" : "node-box"}>
      <span className="node-box-icon">
        <NodeIcon />
      </span>
      <span>{title}</span>
    </span>
  );
}

export function NodeShape({ color }: { color?: string }) {
  return <span className="node-shape" style={color ? { background: color } : undefined} />;
}

/** @deprecated Prefer `NodeBox` for content-sized diagram cards. */
export function NodeCard({ title, hint }: { title: string; hint: string }) {
  return <NodeBox title={`${title} · ${hint}`} />;
}

export function createPipeline(): { nodes: NodeData[]; edges: EdgeData[] } {
  return {
    nodes: [
      {
        id: "kanban",
        position: { x: 48, y: 36 },
        data: <NodeBox title="Kanban & Tablo" />,
      },
      {
        id: "form",
        position: { x: 248, y: 36 },
        data: <NodeBox title="Form" />,
      },
      {
        id: "pdf",
        position: { x: 392, y: 36 },
        data: <NodeBox title="PDF" />,
      },
      {
        id: "lookup",
        position: { x: 520, y: 36 },
        data: <NodeBox title="Lookup" />,
      },
      {
        id: "apps",
        position: { x: 248, y: 156 },
        data: <NodeBox title="Uygulama / Modül / Sayfalar" accent />,
      },
      {
        id: "bridge",
        position: { x: 336, y: 268 },
        data: <NodeShape color="var(--green-500)" />,
      },
      {
        id: "client",
        position: { x: 292, y: 360 },
        data: <NodeBox title="FlowaERP CLIENT" />,
      },
      {
        id: "out-1",
        position: { x: 180, y: 500 },
        data: <NodeShape color="var(--orange-500)" />,
      },
      {
        id: "out-2",
        position: { x: 260, y: 520 },
        data: <NodeShape color="var(--orange-500)" />,
      },
      {
        id: "out-3",
        position: { x: 340, y: 528 },
        data: <NodeShape color="var(--orange-500)" />,
      },
      {
        id: "out-4",
        position: { x: 420, y: 520 },
        data: <NodeShape color="var(--orange-500)" />,
      },
      {
        id: "out-5",
        position: { x: 500, y: 500 },
        data: <NodeShape color="var(--orange-500)" />,
      },
    ],
    edges: [
      { id: "e1", from: { id: "kanban", port: "bottom" }, to: { id: "apps", port: "top" } },
      { id: "e2", from: { id: "form", port: "bottom" }, to: { id: "apps", port: "top" } },
      { id: "e3", from: { id: "pdf", port: "bottom" }, to: { id: "apps", port: "top" } },
      { id: "e4", from: { id: "lookup", port: "bottom" }, to: { id: "apps", port: "top" } },
      { id: "e5", from: { id: "apps", port: "bottom" }, to: { id: "bridge", port: "top" } },
      { id: "e6", from: { id: "bridge", port: "bottom" }, to: { id: "client", port: "top" } },
      { id: "e7", from: { id: "client", port: "bottom" }, to: { id: "out-1", port: "top" } },
      { id: "e8", from: { id: "client", port: "bottom" }, to: { id: "out-2", port: "top" } },
      { id: "e9", from: { id: "client", port: "bottom" }, to: { id: "out-3", port: "top" } },
      { id: "e10", from: { id: "client", port: "bottom" }, to: { id: "out-4", port: "top" } },
      { id: "e11", from: { id: "client", port: "bottom" }, to: { id: "out-5", port: "top" } },
    ],
  };
}

export function DiagramFrame({
  children,
  height = "36rem",
}: {
  children: ReactNode;
  height?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: "var(--radius-12)",
      }}
    >
      {children}
    </div>
  );
}
