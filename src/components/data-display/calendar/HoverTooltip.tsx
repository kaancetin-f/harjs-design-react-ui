"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getTooltipTransform } from "./helpers";

const HoverTooltip = ({ children }: { children: React.ReactNode }) => {
  // refs
  const _nodeRef = useRef<HTMLDivElement>(null);
  const _last = useRef({ x: 0, y: 0 });

  // methods
  const position = (x: number, y: number) => {
    const node = _nodeRef.current;
    if (!node) return;
    node.style.top = `${y}px`;
    node.style.left = `${x}px`;
    node.style.transform = getTooltipTransform(x, y, window.innerWidth, window.innerHeight);
  };

  // useEffects
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      _last.current = { x: event.clientX, y: event.clientY };
      position(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    position(_last.current.x, _last.current.y);
  }, [children]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div ref={_nodeRef} className="har-calendar-tooltip" role="tooltip">
      {children}
    </div>,
    document.body,
  );
};

HoverTooltip.displayName = "Calendar.HoverTooltip";
export default HoverTooltip;
