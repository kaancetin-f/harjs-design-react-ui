import React from "react";
import { EdgeData, NodeData } from "../../../libs/infrastructure/types";

export type Config = {
  color?: string;
  locale?: Intl.LocalesArgument;
  /**
   * Display-only canvas. Pan and zoom stay on. Overrides the flags below.
   */
  readOnly?: boolean;
  /**
   * Move nodes by dragging. Default `true`.
   */
  draggable?: boolean;
  /**
   * Draw a new edge from a port onto another port. Default `true`.
   */
  connectable?: boolean;
  /**
   * Drop a port on empty canvas to add a linked node. Default `true`.
   */
  creatable?: boolean;
  /**
   * Grab an existing edge near an end and drop it on another port. Default `true`.
   */
  reconnectable?: boolean;
  /**
   * Drop a grabbed edge on empty canvas to remove it. Requires `reconnectable`. Default `true`.
   */
  disconnectable?: boolean;
};

interface IProps {
  nodes: NodeData[];
  edges: EdgeData[];
  onNodeClick?: (node: NodeData, event: React.MouseEvent) => void;
  onNodesChange?: (nodes: NodeData[]) => void;
  onEdgesChange?: (edges: EdgeData[]) => void;
  config?: Config;
}

export default IProps;
