"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../../../assets/css/components/data-display/diagram/styles.css";
import GridSystem from "../../layout/grid-system";
import Button from "../../form/button";
import Tooltip from "../../feedback/tooltip";
import { Icon } from "../../icons";
import IProps, { Config } from "./IProps";
import { EdgeData, NodeData } from "../../../libs/infrastructure/types";
import { Interaction, LinkDrag, PortSide, Position } from "./types";
import { useTranslation } from "@harjs/translation";
import IDiagramLocale from "../../../libs/core/application/locales/diagram/IDiagramLocale";
import DiagramTR from "../../../libs/core/application/locales/diagram/tr";
import DiagramEN from "../../../libs/core/application/locales/diagram/en";

const PORTS: PortSide[] = ["top", "right", "bottom", "left"];
const NEW_NODE_SIZE = { width: 136, height: 58 };
const SNAP_THRESHOLD = 36;
const LINK_THRESHOLD = 12;

const resolveInteraction = (config?: Config): Interaction => {
  if (config?.readOnly) {
    return {
      draggable: false,
      connectable: false,
      creatable: false,
      reconnectable: false,
      disconnectable: false,
    };
  }

  return {
    draggable: config?.draggable ?? true,
    connectable: config?.connectable ?? true,
    creatable: config?.creatable ?? true,
    reconnectable: config?.reconnectable ?? true,
    disconnectable: config?.disconnectable ?? true,
  };
};

const { Box } = GridSystem;

const graphKey = (nodes: NodeData[], edges: EdgeData[]) =>
  [
    nodes.map((node) => `${node.id}:${node.position.x}:${node.position.y}`).join("|"),
    edges.map((edge) => `${edge.id}:${edge.from.id}.${edge.from.port}->${edge.to.id}.${edge.to.port}`).join("|"),
  ].join("::");

const sameEndpoint = (a: { id: string | number; port: PortSide }, b: { id: string | number; port: PortSide }) =>
  a.id === b.id && a.port === b.port;

const portFromApproach = (from: Position, to: Position): PortSide => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? "left" : "right";
  return dy >= 0 ? "top" : "bottom";
};

const positionForNewNode = (drop: Position, port: PortSide): Position => {
  const { width, height } = NEW_NODE_SIZE;

  switch (port) {
    case "left":
      return { x: drop.x, y: drop.y - height / 2 };
    case "right":
      return { x: drop.x - width, y: drop.y - height / 2 };
    case "top":
      return { x: drop.x - width / 2, y: drop.y };
    case "bottom":
      return { x: drop.x - width / 2, y: drop.y - height };
  }
};

const Diagram: React.FC<IProps> = ({ nodes, edges, onNodeClick, onNodesChange, onEdgesChange, config }) => {
  // refs
  const _arDiagram = useRef<HTMLDivElement | null>(null);
  const _content = useRef<HTMLDivElement | null>(null);
  const _nodesWrapper = useRef<HTMLDivElement | null>(null);
  const _tempPath = useRef<SVGPathElement | null>(null);
  const _nodeEls = useRef<Record<string, HTMLDivElement | null>>({});
  const _portEls = useRef<Record<string, HTMLSpanElement | null>>({});
  const _edgeGroups = useRef<Record<string, SVGGElement | null>>({});
  const _positions = useRef<Record<string, Position>>(
    Object.fromEntries(nodes.map((node) => [String(node.id), { ...node.position }])),
  );
  const _raf = useRef<number | null>(null);
  const _targetPortKey = useRef<string | null>(null);
  // refs -> Start Position
  const _dragStartMousePosition = useRef<Position>({ x: 0, y: 0 });
  const _dragStartNodePosition = useRef<Position>({ x: 0, y: 0 });
  // refs -> Pan
  const _pan = useRef<Position>({ x: 0, y: 0 });
  const _panning = useRef(false);
  const _startPan = useRef<Position>({ x: 0, y: 0 });
  // refs -> Zoom
  const _scale = useRef(1);
  const _zoomIntensity = 0.1;
  const _maxScale = 4;
  const _minScale = 0.1;
  // refs -> Drag
  const _draggedNode = useRef<string | number | null>(null);
  const _nodeMoved = useRef(false);
  const _clickThreshold = 5;
  // refs -> Drawing
  const _linkDrag = useRef<LinkDrag | null>(null);
  const _linkGrabPoint = useRef<Position | null>(null);
  const _drawCursor = useRef<Position | null>(null);
  // refs -> Latest
  const _nodesLive = useRef<NodeData[]>(nodes);
  const _edgesLive = useRef<EdgeData[]>(edges);
  const _onNodesChange = useRef(onNodesChange);
  const _onEdgesChange = useRef(onEdgesChange);
  const _onNodeClick = useRef(onNodeClick);
  const _newNodeLabel = useRef("New node");
  const _propsGraphKey = useRef(graphKey(nodes, edges));
  const _interaction = useRef(resolveInteraction(config));

  // states
  const [_nodes, setNodes] = useState<NodeData[]>(nodes);
  const [_edges, setEdges] = useState<EdgeData[]>(edges);
  // states -> Zoom
  const [scaleLabel, setScaleLabel] = useState(100);
  // states -> Drawing
  const [drawingActive, setDrawingActive] = useState(false);
  const [reconnectId, setReconnectId] = useState<string | number | null>(null);

  // hooks
  const { t } = useTranslation<IDiagramLocale>(String(config?.locale ?? "tr"), {
    tr: { ...DiagramTR },
    en: { ...DiagramEN },
  });

  _nodesLive.current = _nodes;
  _edgesLive.current = _edges;
  _onNodesChange.current = onNodesChange;
  _onEdgesChange.current = onEdgesChange;
  _onNodeClick.current = onNodeClick;
  _newNodeLabel.current = t("Diagram.Node.New");
  _interaction.current = resolveInteraction(config);

  // methods
  const syncPositions = (list: NodeData[]) => {
    const next: Record<string, Position> = {};
    list.forEach((node) => {
      next[String(node.id)] = { ...node.position };
    });
    _positions.current = next;
  };

  const commitNodes = (next: NodeData[]) => {
    _nodesLive.current = next;
    setNodes(next);
    syncPositions(next);
    _onNodesChange.current?.(next);
  };

  const commitEdges = (next: EdgeData[]) => {
    _edgesLive.current = next;
    setEdges(next);
    _onEdgesChange.current?.(next);
  };

  const applyViewTransform = () => {
    const wrapper = _nodesWrapper.current;
    const content = _content.current;
    if (!wrapper || !content) return;

    const { x, y } = _pan.current;
    const scale = _scale.current;
    wrapper.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    content.style.backgroundPosition = `${x}px ${y}px`;
  };

  const syncZoomLabel = () => {
    setScaleLabel(Math.round(_scale.current * 100));
  };

  const portKey = (id: string | number, port: PortSide) => `${id}:${port}`;

  const getPortCenter = (id: string | number, port: PortSide): Position | null => {
    const key = String(id);
    const position = _positions.current[key];
    if (!position) return null;

    const el = _nodeEls.current[key];
    const w = el?.offsetWidth || NEW_NODE_SIZE.width;
    const h = el?.offsetHeight || NEW_NODE_SIZE.height;

    switch (port) {
      case "top":
        return { x: position.x + w / 2, y: position.y };
      case "bottom":
        return { x: position.x + w / 2, y: position.y + h };
      case "left":
        return { x: position.x, y: position.y + h / 2 };
      case "right":
        return { x: position.x + w, y: position.y + h / 2 };
    }
  };

  const getPortOffset = (port: PortSide, distance: number): Position => {
    switch (port) {
      case "top":
        return { x: 0, y: -distance };
      case "bottom":
        return { x: 0, y: distance };
      case "left":
        return { x: -distance, y: 0 };
      case "right":
        return { x: distance, y: 0 };
    }
  };

  const buildCurvePath = (from: Position, fromPort: PortSide, to: Position, toPort: PortSide): string => {
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const offset = Math.min(60, Math.max(24, distance * 0.35));
    const c1 = getPortOffset(fromPort, offset);
    const c2 = getPortOffset(toPort, offset);

    return `M${from.x} ${from.y} C${from.x + c1.x} ${from.y + c1.y}, ${to.x + c2.x} ${to.y + c2.y}, ${to.x} ${to.y}`;
  };

  const paintEdges = () => {
    _edgesLive.current.forEach((edge) => {
      const group = _edgeGroups.current[String(edge.id)];
      if (!group) return;

      const flow = group.querySelector("path.flow");
      const hit = group.querySelector("path.hit");
      const from = getPortCenter(edge.from.id, edge.from.port);
      const to = getPortCenter(edge.to.id, edge.to.port);

      if (!from || !to) {
        flow?.setAttribute("d", "");
        hit?.setAttribute("d", "");
        return;
      }

      const d = buildCurvePath(from, edge.from.port, to, edge.to.port);
      flow?.setAttribute("d", d);
      hit?.setAttribute("d", d);
    });
  };

  const clientToContent = (clientX: number, clientY: number): Position => {
    const rect = _arDiagram.current!.getBoundingClientRect();

    return {
      x: (clientX - rect.left - _pan.current.x) / _scale.current,
      y: (clientY - rect.top - _pan.current.y) / _scale.current,
    };
  };

  const getClosestPort = (
    position: Position,
    ignore?: { id: string | number; port: PortSide },
    threshold = SNAP_THRESHOLD,
  ): { id: string | number; port: PortSide } | null => {
    let best: { id: string | number; port: PortSide; distance: number } | null = null;

    for (const node of _nodesLive.current) {
      for (const port of PORTS) {
        if (ignore && node.id === ignore.id && port === ignore.port) continue;

        const center = getPortCenter(node.id, port);
        if (!center) continue;

        const distance = Math.hypot(position.x - center.x, position.y - center.y);
        if (distance > threshold) continue;

        if (!best || distance < best.distance) {
          best = { id: node.id, port, distance };
        }
      }
    }

    return best ? { id: best.id, port: best.port } : null;
  };

  const markTargetPort = (target: { id: string | number; port: PortSide } | null) => {
    const nextKey = target ? portKey(target.id, target.port) : null;
    if (_targetPortKey.current === nextKey) return;

    if (_targetPortKey.current) {
      _portEls.current[_targetPortKey.current]?.classList.remove("is-target");
    }

    if (nextKey) {
      _portEls.current[nextKey]?.classList.add("is-target");
    }

    _targetPortKey.current = nextKey;
  };

  const paintTempPath = (from: Position, fromPort: PortSide, to: Position) => {
    if (!_tempPath.current) return;

    const toPort = portFromApproach(from, to);
    _tempPath.current.setAttribute("d", buildCurvePath(from, fromPort, to, toPort));
  };

  const isDuplicateEdge = (list: EdgeData[], from: EdgeData["from"], to: EdgeData["to"], ignoreId?: string | number) =>
    list.some((edge) => {
      if (ignoreId !== undefined && edge.id === ignoreId) return false;

      return (
        (sameEndpoint(edge.from, from) && sameEndpoint(edge.to, to)) ||
        (sameEndpoint(edge.from, to) && sameEndpoint(edge.to, from))
      );
    });

  const setZoomAroundPoint = (newScale: number, pointX: number, pointY: number) => {
    const scale = _scale.current;
    const pan = _pan.current;
    const zoomPointX = (pointX - pan.x) / scale;
    const zoomPointY = (pointY - pan.y) / scale;

    _scale.current = newScale;
    _pan.current = {
      x: pointX - zoomPointX * newScale,
      y: pointY - zoomPointY * newScale,
    };

    applyViewTransform();
    syncZoomLabel();
  };

  const capturePointer = (event: React.PointerEvent) => {
    _arDiagram.current?.setPointerCapture(event.pointerId);
  };

  const onPanStart = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    if (_draggedNode.current || _linkDrag.current) return;
    if ((event.target as Element).closest(".node, .zoom-buttons, .edge")) return;

    event.preventDefault();
    _panning.current = true;
    _startPan.current = { x: event.clientX - _pan.current.x, y: event.clientY - _pan.current.y };
    capturePointer(event);
  };

  const onPanEnd = () => {
    _panning.current = false;
  };

  // methods -> Zoom
  const handleZoom = (process: "increment" | "decrement") => {
    let newScale = _scale.current;

    if (process === "increment") newScale = Math.max(_minScale, Math.min(_maxScale, _scale.current + _zoomIntensity));
    if (process === "decrement") newScale = Math.max(_minScale, Math.min(_maxScale, _scale.current - _zoomIntensity));

    if (newScale === _scale.current || !_content.current) return;

    const containerRect = _content.current.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    setZoomAroundPoint(newScale, centerX, centerY);
  };

  const handleZoomReset = () => {
    if (_scale.current === 1 && _pan.current.x === 0 && _pan.current.y === 0) return;

    _scale.current = 1;
    _pan.current = { x: 0, y: 0 };
    applyViewTransform();
    syncZoomLabel();
  };

  // methods -> Node
  const onNodeMouseDown = (event: React.PointerEvent, id: string | number) => {
    if (event.button !== 0) return;

    event.stopPropagation();

    const position = _positions.current[String(id)] ?? _nodesLive.current.find((node) => node.id === id)?.position;
    if (!position) return;

    _positions.current[String(id)] = { ...position };
    _draggedNode.current = id;
    _nodeMoved.current = false;
    _dragStartMousePosition.current = { x: event.clientX, y: event.clientY };
    _dragStartNodePosition.current = { ...position };
    capturePointer(event);
  };

  const onPortMouseDown = (event: React.PointerEvent, id: string | number, port: PortSide) => {
    if (event.button !== 0 || !_interaction.current.connectable) return;

    event.stopPropagation();
    event.preventDefault();

    const from = getPortCenter(id, port);
    if (!from) return;

    _linkDrag.current = { mode: "create", source: { id, port, start: from } };
    _linkGrabPoint.current = from;
    _drawCursor.current = from;
    setReconnectId(null);
    setDrawingActive(true);
    capturePointer(event);
  };

  const onEdgeMouseDown = (event: React.PointerEvent, edge: EdgeData) => {
    if (event.button !== 0 || !_interaction.current.reconnectable) return;

    event.stopPropagation();
    event.preventDefault();

    const point = clientToContent(event.clientX, event.clientY);
    const from = getPortCenter(edge.from.id, edge.from.port);
    const to = getPortCenter(edge.to.id, edge.to.port);
    if (!from || !to) return;

    const end =
      Math.hypot(point.x - from.x, point.y - from.y) <= Math.hypot(point.x - to.x, point.y - to.y) ? "from" : "to";
    const anchorSide = end === "from" ? to : from;
    const anchorMeta = end === "from" ? edge.to : edge.from;

    _linkDrag.current = {
      mode: "reconnect",
      edgeId: edge.id,
      end,
      anchor: { id: anchorMeta.id, port: anchorMeta.port, start: anchorSide },
    };
    _linkGrabPoint.current = point;
    _drawCursor.current = point;
    setReconnectId(edge.id);
    setDrawingActive(true);
    paintTempPath(anchorSide, anchorMeta.port, point);
    capturePointer(event);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (_panning.current) {
      _pan.current = {
        x: event.clientX - _startPan.current.x,
        y: event.clientY - _startPan.current.y,
      };
      applyViewTransform();
      return;
    }

    const link = _linkDrag.current;
    if (link) {
      const point = clientToContent(event.clientX, event.clientY);
      _drawCursor.current = point;

      const origin = link.mode === "create" ? link.source : link.anchor;
      paintTempPath(origin.start, origin.port, point);
      markTargetPort(getClosestPort(point, { id: origin.id, port: origin.port }));
      return;
    }

    if (!_draggedNode.current || !_interaction.current.draggable) return;

    const deltaX = event.clientX - _dragStartMousePosition.current.x;
    const deltaY = event.clientY - _dragStartMousePosition.current.y;

    if (!_nodeMoved.current) {
      if (Math.hypot(deltaX, deltaY) <= _clickThreshold) return;
      _nodeMoved.current = true;
    }

    const id = _draggedNode.current;
    const scale = _scale.current;
    const newX = _dragStartNodePosition.current.x + deltaX / scale;
    const newY = _dragStartNodePosition.current.y + deltaY / scale;

    _positions.current[String(id)] = { x: newX, y: newY };

    const nodeEl = _nodeEls.current[String(id)];
    if (nodeEl) {
      nodeEl.style.left = `${newX}px`;
      nodeEl.style.top = `${newY}px`;
    }

    if (_raf.current == null) {
      _raf.current = requestAnimationFrame(() => {
        _raf.current = null;
        paintEdges();
      });
    }
  };

  const finishLink = (endPoint: Position) => {
    const link = _linkDrag.current;
    if (!link) return;

    const origin = link.mode === "create" ? link.source : link.anchor;
    const grab = _linkGrabPoint.current ?? origin.start;
    const dragDistance = Math.hypot(endPoint.x - grab.x, endPoint.y - grab.y);
    const closest = getClosestPort(endPoint, { id: origin.id, port: origin.port });

    if (link.mode === "create") {
      if (closest) {
        if (!isDuplicateEdge(_edgesLive.current, { id: origin.id, port: origin.port }, closest)) {
          commitEdges([
            ..._edgesLive.current,
            {
              id: crypto.randomUUID(),
              from: { id: origin.id, port: origin.port },
              to: closest,
            },
          ]);
        }
      } else if (_interaction.current.creatable && dragDistance > LINK_THRESHOLD) {
        const newNodeId = crypto.randomUUID();
        const newPort = portFromApproach(origin.start, endPoint);
        const newNode: NodeData = {
          id: newNodeId,
          position: positionForNewNode(endPoint, newPort),
          data: (
            <span className="node-placeholder">
              <span className="node-placeholder-dot" />
              <span>{_newNodeLabel.current}</span>
            </span>
          ),
        };

        commitNodes([..._nodesLive.current, newNode]);
        commitEdges([
          ..._edgesLive.current,
          {
            id: crypto.randomUUID(),
            from: { id: origin.id, port: origin.port },
            to: { id: newNodeId, port: newPort },
          },
        ]);
      }
      return;
    }

    if (closest) {
      const nextFrom = link.end === "from" ? closest : { id: origin.id, port: origin.port };
      const nextTo = link.end === "to" ? closest : { id: origin.id, port: origin.port };

      if (!sameEndpoint(nextFrom, nextTo) && !isDuplicateEdge(_edgesLive.current, nextFrom, nextTo, link.edgeId)) {
        commitEdges(
          _edgesLive.current.map((edge) => (edge.id === link.edgeId ? { ...edge, from: nextFrom, to: nextTo } : edge)),
        );
      }
      return;
    }

    if (dragDistance > LINK_THRESHOLD && _interaction.current.disconnectable) {
      commitEdges(_edgesLive.current.filter((edge) => edge.id !== link.edgeId));
    }
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (_linkDrag.current) {
      const endPoint = _drawCursor.current ?? clientToContent(event.clientX, event.clientY);
      finishLink(endPoint);

      _linkDrag.current = null;
      _linkGrabPoint.current = null;
      _drawCursor.current = null;
      markTargetPort(null);
      setReconnectId(null);
      setDrawingActive(false);
      if (_tempPath.current) _tempPath.current.setAttribute("d", "");
    }

    if (_draggedNode.current) {
      const id = _draggedNode.current;
      const wasClick = !_nodeMoved.current;
      const position = _positions.current[String(id)];

      if (_nodeMoved.current && position) {
        commitNodes(_nodesLive.current.map((node) => (node.id === id ? { ...node, position: { ...position } } : node)));
        paintEdges();
      }

      _draggedNode.current = null;
      _nodeMoved.current = false;

      if (wasClick && event.button === 0) {
        const node = _nodesLive.current.find((item) => item.id === id);
        if (node) _onNodeClick.current?.(node, event as unknown as React.MouseEvent);
      }
    }

    onPanEnd();
  };

  // useEffects
  useEffect(() => {
    const nextKey = graphKey(nodes, edges);
    if (nextKey === _propsGraphKey.current) return;

    _propsGraphKey.current = nextKey;
    _nodesLive.current = nodes;
    _edgesLive.current = edges;
    setNodes(nodes);
    setEdges(edges);
    syncPositions(nodes);
  }, [nodes, edges]);

  useEffect(() => {
    applyViewTransform();
  }, []);

  useEffect(() => {
    const content = _content.current;
    if (!content) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      const direction = event.deltaY > 0 ? -1 : 1;
      let newScale = _scale.current + direction * _zoomIntensity;
      newScale = Math.max(_minScale, Math.min(_maxScale, newScale));

      if (newScale === _scale.current) return;

      const rect = content.getBoundingClientRect();
      setZoomAroundPoint(newScale, event.clientX - rect.left, event.clientY - rect.top);
    };

    content.addEventListener("wheel", onWheel, { passive: false });
    return () => content.removeEventListener("wheel", onWheel);
  }, []);

  useLayoutEffect(() => {
    if (!_draggedNode.current) syncPositions(_nodes);
    paintEdges();
  }, [_nodes, _edges, reconnectId]);

  useEffect(() => {
    return () => {
      if (_raf.current != null) cancelAnimationFrame(_raf.current);
    };
  }, []);

  const interaction = _interaction.current;
  const className = [
    "har-diagram",
    drawingActive ? "is-linking" : undefined,
    config?.readOnly ? "is-readonly" : undefined,
    interaction.draggable ? "is-draggable" : undefined,
    interaction.connectable ? "is-connectable" : undefined,
    interaction.reconnectable ? "is-reconnectable" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={_arDiagram}
      className={className}
      style={config?.color ? ({ "--diagram-edge-color": config.color } as React.CSSProperties) : undefined}
      onPointerDown={onPanStart}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
    >
      <div ref={_content} className="content">
        <div ref={_nodesWrapper} className="nodes-wrapper">
          {/* Edges */}
          <div className="edges">
            <svg className="edge-layer" width="8000" height="8000">
              {_edges.map((edge) => (
                <g
                  key={edge.id}
                  ref={(el) => {
                    const key = String(edge.id);
                    if (el) _edgeGroups.current[key] = el;
                    else delete _edgeGroups.current[key];
                  }}
                  className="edge"
                  style={reconnectId === edge.id ? { visibility: "hidden" } : undefined}
                  onPointerDown={(event) => onEdgeMouseDown(event, edge)}
                >
                  <path className="hit" />
                  <path className="flow" />
                </g>
              ))}
            </svg>

            <svg className="edge-temp" width="8000" height="8000" aria-hidden={!drawingActive}>
              <path ref={_tempPath} style={{ visibility: drawingActive ? "visible" : "hidden" }} />
            </svg>
          </div>

          {/* Nodes */}
          <div className="nodes">
            {_nodes.map((node) => (
              <div
                key={node.id}
                ref={(el) => {
                  const key = String(node.id);
                  if (el) _nodeEls.current[key] = el;
                  else delete _nodeEls.current[key];
                }}
                className="node"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                }}
                onPointerDown={(event) => onNodeMouseDown(event, node.id)}
              >
                {PORTS.map((port) => (
                  <span
                    key={port}
                    ref={(el) => {
                      const key = portKey(node.id, port);
                      if (el) _portEls.current[key] = el;
                      else delete _portEls.current[key];
                    }}
                    className={`port ${port}`}
                    onPointerDown={(event) => onPortMouseDown(event, node.id, port)}
                  />
                ))}

                <span className="node-content">{node.data}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="zoom-buttons" onPointerDown={(event) => event.stopPropagation()}>
        <Box>
          <Tooltip text={t("Diagram.Zoom.Out.Tooltip")}>
            <Button
              variant="borderless"
              color="gray"
              shape="square"
              icon={{ element: <Icon icon={"Dash"} fill="currentColor" /> }}
              onClick={() => handleZoom("decrement")}
            />
          </Tooltip>

          <div className="zoom-percent">{scaleLabel}%</div>

          <Tooltip text={t("Diagram.Zoom.In.Tooltip")}>
            <Button
              variant="borderless"
              color="gray"
              shape="square"
              icon={{ element: <Icon icon={"Add"} fill="currentColor" /> }}
              onClick={() => handleZoom("increment")}
            />
          </Tooltip>

          {scaleLabel !== 100 && (
            <Tooltip text={t("Diagram.Zoom.Reset.Tooltip")}>
              <Button variant="borderless" color="gray" onClick={handleZoomReset}>
                {t("Diagram.Zoom.Reset.Text")}
              </Button>
            </Tooltip>
          )}
        </Box>
      </div>
    </div>
  );
};

Diagram.displayName = "Diagram";

export default Diagram;
