"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../../assets/css/components/data-display/diagram/styles.css";
import Grid from "../grid-system";
import Button from "../../form/button";
import Tooltip from "../../feedback/tooltip";
import { ARIcon } from "../../icons";
import IProps from "./IProps";
import { EdgeData, NodeData } from "../../../libs/infrastructure/types";

type Position = { x: number; y: number };

const { Box } = Grid;

const Diagram: React.FC<IProps> = ({ nodes, edges }) => {
  // refs
  const _arDiagram = useRef<HTMLDivElement | null>(null);
  const _content = useRef<HTMLDivElement | null>(null);
  const _arNodes = useRef<Record<string, HTMLSpanElement>>({});
  const _path = useRef<SVGPathElement | null>(null);
  // refs -> Start Position
  const _dragStartMousePosition = useRef<Position>({ x: 0, y: 0 });
  const _dragStartNodePosition = useRef<Position>({ x: 0, y: 0 });
  // refs -> Zoom
  const _zoomIntensity = 0.1;
  const _maxScale = 4;
  const _minScale = 0.1;

  // states
  const [_nodes, setNodes] = useState<NodeData[]>(nodes);
  const [_edges, setEdges] = useState<EdgeData[]>(edges);
  const [trigger, setTrigger] = useState<boolean>(false);
  // states -> Pan
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [panning, setPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<Position>({ x: 0, y: 0 });
  // states -> Zoom
  const [scale, setScale] = useState<number>(1);
  // states -> Drag
  const [draggedNode, setDraggedNode] = useState<string | number | null>(null);
  // states -> Drawing
  const [drawingEdge, setDrawingEdge] = useState<{
    id: string | number;
    port: "top" | "right" | "bottom" | "left";
    start: Position;
  } | null>(null);
  const [mousePos, setMousePos] = useState<Position | null>(null);

  // methods
  const getPortCenter = (id: string | number, port: "top" | "right" | "bottom" | "left"): Position | null => {
    const node = _arNodes.current[`${id}_${port}`];
    const diagram = _arDiagram.current;

    if (!node || !diagram) return null;

    const diagramRect = diagram.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    return {
      x: (nodeRect.left - diagramRect.left + nodeRect.width / 2 - pan.x) / scale,
      y: (nodeRect.top - diagramRect.top + nodeRect.height / 2 - pan.y) / scale,
    };
  };

  const getClosestPort = (
    position: Position,
    threshold = 20,
  ): { id: string | number; port: "top" | "bottom" } | null => {
    for (const key in _arNodes.current) {
      const el = _arNodes.current[key];

      if (!el) continue;

      const [idStr, port] = key.split("_");
      const id = parseInt(idStr, 10);
      const rect = el.getBoundingClientRect();
      const diagramRect = _arDiagram.current!.getBoundingClientRect();

      const portCenter: Position = {
        x: (rect.left - diagramRect.left + rect.width / 2 - pan.x) / scale,
        y: (rect.top - diagramRect.top + rect.height / 2 - pan.y) / scale,
      };

      const distance = Math.hypot(position.x - portCenter.x, position.y - portCenter.y);

      if (distance <= threshold) return { id, port: port as "top" | "bottom" };
    }

    return null;
  };

  const renderEdges = useMemo(() => {
    return _edges.map((edge, index) => {
      const from = getPortCenter(edge.from.id, edge.from.port);
      const to = getPortCenter(edge.to.id, edge.to.port);

      if (!from || !to) return null;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.hypot(dx, dy);
      const offset = Math.min(40, distance * 0.25); // maksimum sapma sınırı

      // S biçimli kontrol noktaları
      const controlPoint1 = {
        x: from.x,
        y: from.y + (dy < 0 ? -offset : offset),
      };

      const controlPoint2 = {
        x: to.x,
        y: to.y + (dy < 0 ? offset : -offset),
      };

      const pathData = `M${from.x} ${from.y} C${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${to.x} ${to.y}`;

      return (
        <svg key={index} className="edge">
          <path
            ref={_path}
            d={pathData}
            fill="none"
            stroke="var(--purple-500)"
            strokeWidth={2}
            strokeDasharray={10}
            strokeDashoffset={10}
            strokeLinecap="round"
          >
            <animate attributeName="stroke-dashoffset" values={`${20 / scale};0`} dur="1s" repeatCount="indefinite" />
          </path>
        </svg>
      );
    });
  }, [_nodes, _edges, trigger]);

  const onPanStart = (e: React.MouseEvent) => {
    // Node sürükleniyorsa pan başlatma.
    if (draggedNode) return;

    setPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const onPanMove = (e: React.MouseEvent) => {
    if (panning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  };

  const onPanEnd = () => setPanning(false);

  // methods -> Zoom
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const direction = event.deltaY > 0 ? -1 : 1;

    let newScale = scale + direction * _zoomIntensity;
    newScale = Math.max(_minScale, Math.min(_maxScale, newScale));

    // Mouse'un container içindeki konumunu al.
    const rect = _content.current!.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // İçerik düzleminde mouse'un bulunduğu noktayı bul.
    const zoomPointX = (mouseX - pan.x) / scale;
    const zoomPointY = (mouseY - pan.y) / scale;

    // Yeni pan değerini hesapla ki zoomPoint sabit kalsın.
    const newPanX = mouseX - zoomPointX * newScale;
    const newPanY = mouseY - zoomPointY * newScale;

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleZoom = (process: "increment" | "decrement") => {
    let newScale: number = 0;

    if (process === "increment") newScale = Math.max(_minScale, Math.min(_maxScale, scale + _zoomIntensity));
    if (process === "decrement") newScale = Math.max(_minScale, Math.min(_maxScale, scale - _zoomIntensity));

    if (_content.current && _content.current) {
      const containerRect = _content.current.getBoundingClientRect();

      // Ortadaki noktayı bul (container açısından)
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      // İçerik düzleminde bu noktaya karşılık gelen nokta
      const zoomPointX = (centerX - pan.x) / scale;
      const zoomPointY = (centerY - pan.y) / scale;

      // Yeni pan hesapla ki center aynı yerde kalsın
      const newPanX = centerX - zoomPointX * newScale;
      const newPanY = centerY - zoomPointY * newScale;

      setPan({ x: newPanX, y: newPanY });
      setScale(newScale);
    }
  };

  // methods -> Node
  const onNodeMouseDown = (event: React.MouseEvent, id: string | number, node: Position) => {
    event.stopPropagation();

    setDraggedNode(id);
    _dragStartMousePosition.current = { x: event.clientX, y: event.clientY };
    _dragStartNodePosition.current = { x: node.x, y: node.y };
  };

  const onMouseMove = (event: React.MouseEvent) => {
    if (drawingEdge) {
      const rect = _arDiagram.current!.getBoundingClientRect();
      const x = (event.clientX - rect.left - pan.x) / scale;
      const y = (event.clientY - rect.top - pan.y) / scale;

      setMousePos({ x, y });
    }

    if (draggedNode) {
      const deltaX = (event.clientX - _dragStartMousePosition.current.x) / scale;
      const deltaY = (event.clientY - _dragStartMousePosition.current.y) / scale;

      const newX = _dragStartNodePosition.current.x + deltaX;
      const newY = _dragStartNodePosition.current.y + deltaY;

      setNodes((prev) =>
        prev.map((node) => (node.id === draggedNode ? { ...node, position: { x: newX, y: newY } } : node)),
      );
    }
  };

  const onMouseUp = () => {
    if (drawingEdge && mousePos) {
      const closest = getClosestPort(mousePos);

      if (closest) {
        // Yakın port varsa, oraya bağla
        const newEdge: EdgeData = {
          id: crypto.randomUUID(), // _edges[_edges.length - 1]?.id + 1 || 1,
          from: { id: drawingEdge.id, port: drawingEdge.port },
          to: { id: closest.id, port: closest.port },
        };

        // Aynı edge daha önce eklenmiş mi kontrol et
        const isDuplicate = _edges.some((edge) => {
          const samePair =
            (edge.from.id === newEdge.from.id && edge.to.id === newEdge.to.id) ||
            (edge.from.id === newEdge.to.id && edge.to.id === newEdge.from.id);

          return samePair;
        });

        if (!isDuplicate) setEdges((prev) => [...prev, newEdge]);
      } else {
        // Yakın port yoksa yeni node oluştur
        const newNodeId = crypto.randomUUID(); // _nodes[_nodes.length - 1]?.id + 1 || 1;

        const newNode: NodeData = {
          id: newNodeId,
          position: mousePos,
          data: <></>,
        };

        const newPort: "top" | "bottom" = mousePos.y < drawingEdge.start.y ? "bottom" : "top";

        const newEdge: EdgeData = {
          id: crypto.randomUUID(), // _edges[_edges.length - 1]?.id + 1 || 1,
          from: { id: drawingEdge.id, port: drawingEdge.port },
          to: { id: newNodeId, port: newPort },
        };

        setNodes((prev) => [...prev, newNode]);
        setEdges((prev) => [...prev, newEdge]);
      }

      setDrawingEdge(null);
      setMousePos(null);
    }

    setDraggedNode(null);
    setTrigger((prev) => !prev);
  };

  // useEffects
  useEffect(() => {
    setEdges([...edges]);
  }, []);

  return (
    <div
      ref={_arDiagram}
      className="ar-diagram"
      onMouseDown={onPanStart}
      onMouseMove={(event) => {
        onPanMove(event);
        onMouseMove(event);
      }}
      onMouseUp={() => {
        onMouseUp();
        onPanEnd();
      }}
    >
      <div
        ref={_content}
        className="content"
        style={{ backgroundPosition: `${pan.x}px ${pan.y}px` }}
        onWheel={handleWheel}
      >
        <div
          className="nodes-wrapper"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          {/* Edges */}
          <div className="edges">
            {renderEdges}

            {drawingEdge && mousePos && (
              <svg className="edge-temp">
                <path
                  ref={_path}
                  d={`M${drawingEdge.start.x} ${drawingEdge.start.y} L${mousePos.x} ${mousePos.y}`}
                  fill="none"
                  stroke="var(--purple-500)"
                  strokeWidth={2}
                  strokeDasharray={10}
                  strokeDashoffset={10}
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>

          {/* Nodes */}
          <div className="nodes">
            {_nodes.map((node, index) => (
              <div
                key={index}
                className="node"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                }}
                onMouseDown={(event) => onNodeMouseDown(event, node.id, node.position)}
              >
                {/* Top Port */}
                <span
                  ref={(el) => {
                    if (!el) return;

                    _arNodes.current[`${node.id}_top`] = el;
                  }}
                  className="port top"
                  onMouseDown={(event) => {
                    event.stopPropagation();

                    const port = "top";
                    const from = getPortCenter(node.id, port);

                    if (from) {
                      setDrawingEdge({
                        id: node.id,
                        port,
                        start: from,
                      });
                    }
                  }}
                ></span>

                {/* Left Port */}
                <span
                  ref={(el) => {
                    if (!el) return;
                    _arNodes.current[`${node.id}_left`] = el;
                  }}
                  className="port left"
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    const from = getPortCenter(node.id, "left");
                    if (from) {
                      setDrawingEdge({ id: node.id, port: "left", start: from });
                    }
                  }}
                ></span>

                {/* Node Content */}
                <span>{node.data}</span>

                {/* Right Port */}
                <span
                  ref={(el) => {
                    if (!el) return;
                    _arNodes.current[`${node.id}_right`] = el;
                  }}
                  className="port right"
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    const from = getPortCenter(node.id, "right");
                    if (from) {
                      setDrawingEdge({ id: node.id, port: "right", start: from });
                    }
                  }}
                ></span>

                {/* Bottom Port */}
                <span
                  ref={(el) => {
                    if (!el) return;

                    _arNodes.current[`${node.id}_bottom`] = el;
                  }}
                  className="port bottom"
                  onMouseDown={(event) => {
                    event.stopPropagation();

                    const from = getPortCenter(node.id, "bottom");

                    if (from) {
                      setDrawingEdge({
                        id: node.id,
                        port: "bottom",
                        start: from,
                      });
                    }
                  }}
                ></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="zoom-buttons" onMouseDown={(event) => event.stopPropagation()}>
        <Box>
          <Tooltip text={"Zoom Out"}>
            <Button
              variant="borderless"
              color="light"
              icon={{ element: <ARIcon icon={"Dash"} fill="currentColor" /> }}
              onClick={() => handleZoom("decrement")}
            />
          </Tooltip>

          <div className="zoom-percent">{Math.round(scale * 100)}%</div>

          <Tooltip text={"Zoom In"}>
            <Button
              variant="borderless"
              color="light"
              icon={{ element: <ARIcon icon={"Add"} fill="currentColor" /> }}
              onClick={() => handleZoom("increment")}
            />
          </Tooltip>
        </Box>
      </div>

      <div style={{ zIndex: 555 }}>{JSON.stringify(drawingEdge)}</div>
    </div>
  );
};

export default Diagram;
