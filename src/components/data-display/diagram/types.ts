export type Position = { x: number; y: number };

export type PortSide = "top" | "right" | "bottom" | "left";

export type LinkDrag =
  | { mode: "create"; source: { id: string | number; port: PortSide; start: Position } }
  | {
      mode: "reconnect";
      edgeId: string | number;
      end: "from" | "to";
      anchor: { id: string | number; port: PortSide; start: Position };
    };

export type Interaction = {
  draggable: boolean;
  connectable: boolean;
  creatable: boolean;
  reconnectable: boolean;
  disconnectable: boolean;
};
