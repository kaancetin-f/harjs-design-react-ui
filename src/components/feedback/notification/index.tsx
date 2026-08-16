"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import IProps from "./IProps";
import "../../../assets/css/components/feedback/notification/styles.css";
import {
  Direction,
  Status,
} from "../../../libs/core/application/contexts/Notification";
import { createNotificationId, normalizeStatus } from "./helpers";
import Spinner from "../spinner";

const MAX_VISIBLE_NOTIFICATIONS = 5;
const NOTIFICATION_TIMEOUT = 3000;
const NOTIFICATION_OFFSET = 30;
const NOTIFICATION_GAP = 20;
const NOTIFICATION_OVERFLOW_SPACING = 10;
const NOTIFICATION_EDGE = "2rem";
const NOTIFICATION_HEIGHT = "7.5rem";
const ICON_LAYER_COUNT = 5;

type NotificationItemData = {
  id: string;
  title: string;
  message?: string;
  status: Status;
  direction: Direction;
  pending?: boolean;
};

const getCornerStyle = (direction: Direction): React.CSSProperties => {
  switch (direction) {
    case "top-left":
      return { left: NOTIFICATION_EDGE, right: "auto", bottom: "auto" };
    case "top-right":
      return { left: "auto", right: NOTIFICATION_EDGE, bottom: "auto" };
    case "bottom-right":
      return { left: "auto", right: NOTIFICATION_EDGE, top: "auto" };
    case "bottom-left":
    default:
      return { left: NOTIFICATION_EDGE, right: "auto", top: "auto" };
  }
};

const getStackOffset = (index: number) =>
  `calc(${NOTIFICATION_OFFSET}px + ${index} * (${NOTIFICATION_HEIGHT} + ${NOTIFICATION_GAP}px))`;

const getOverflowOffset = (index: number) =>
  (index === 0 ? NOTIFICATION_OFFSET : NOTIFICATION_OVERFLOW_SPACING) *
  (index + 1);

const getItemPositionStyle = (
  direction: Direction,
  index: number,
  total: number,
): React.CSSProperties => {
  const isTop = direction.startsWith("top");
  const isOverflow = total > MAX_VISIBLE_NOTIFICATIONS;
  const offset = isOverflow ? getOverflowOffset(index) : getStackOffset(index);
  const axisStyle = isTop
    ? { top: offset, bottom: "auto" as const }
    : { bottom: offset, top: "auto" as const };
  const overflowStyle = isOverflow
    ? {
        backgroundColor: `rgba(var(--white-rgb), ${index === total - 1 ? 1 : 0.1})`,
        backdropFilter: "blur(10px)",
      }
    : undefined;

  return { ...getCornerStyle(direction), ...axisStyle, ...overflowStyle };
};

// Tek bir bildirim satırını konumlandırıp render eder.
const NotificationItem = ({
  item,
  index,
  total,
  onClose,
}: {
  item: NotificationItemData;
  index: number;
  total: number;
  onClose: (id: string) => void;
}) => {
  // variables
  const isAlert = item.status === "error" || item.status === "warning";

  return (
    <div
      className={`har-notification-item ${item.direction}`}
      style={getItemPositionStyle(item.direction, index, total)}
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div
        className={item.pending ? "icon is-pending" : "icon"}
        aria-hidden="true"
      >
        {item.pending ? (
          <Spinner size="md" status="information" label="" />
        ) : (
          Array.from({ length: ICON_LAYER_COUNT }, (_, layer) => (
            <span key={layer} className={item.status}></span>
          ))
        )}
      </div>

      <div className="content">
        <span className="title">{item.title}</span>
        {item.message ? <span className="message">{item.message}</span> : null}
      </div>

      <button
        type="button"
        className="close"
        aria-label="Close"
        onClick={() => onClose(item.id)}
        style={{
          background: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer",
        }}
      />
    </div>
  );
};

const Notification = ({
  title = "",
  message,
  status = "information",
  direction = "bottom-left",
  trigger = false,
  duration = NOTIFICATION_TIMEOUT,
  command,
}: IProps) => {
  // refs
  const _lastTriggerRef = useRef(trigger);
  const _lastCommandRevRef = useRef(0);
  const _latestPropsRef = useRef({
    title,
    message,
    status,
    direction,
    duration,
  });
  const _timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // states
  const [items, setItems] = useState<NotificationItemData[]>([]);

  _latestPropsRef.current = { title, message, status, direction, duration };

  // methods
  const removeNotification = useCallback((id: string) => {
    const timeoutId = _timeoutsRef.current.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      _timeoutsRef.current.delete(id);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const scheduleTimeout = useCallback(
    (id: string, nextDuration: number) => {
      const existing = _timeoutsRef.current.get(id);
      if (existing !== undefined) {
        clearTimeout(existing);
        _timeoutsRef.current.delete(id);
      }

      if (nextDuration === 0 || !Number.isFinite(nextDuration)) return;

      const timeoutId = setTimeout(() => removeNotification(id), nextDuration);
      _timeoutsRef.current.set(id, timeoutId);
    },
    [removeNotification],
  );

  // useEffects
  useEffect(() => {
    const timeouts = _timeoutsRef.current;
    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  useEffect(() => {
    if (_lastTriggerRef.current === trigger) return;
    _lastTriggerRef.current = trigger;

    const snapshot = _latestPropsRef.current;
    const id = createNotificationId();

    setItems((prev) => [
      ...prev,
      {
        id,
        title: snapshot.title,
        message: snapshot.message,
        status: normalizeStatus(snapshot.status),
        direction: snapshot.direction,
      },
    ]);

    scheduleTimeout(id, snapshot.duration);
  }, [trigger, scheduleTimeout]);

  useEffect(() => {
    if (!command) return;
    if (_lastCommandRevRef.current === command.rev) return;
    _lastCommandRevRef.current = command.rev;

    if (command.op === "dismiss") {
      removeNotification(command.id);
      return;
    }

    const nextDuration = command.duration ?? NOTIFICATION_TIMEOUT;
    const fallbackDirection = _latestPropsRef.current.direction;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === command.id);
      const nextItem: NotificationItemData = {
        id: command.id,
        title: command.title ?? existing?.title ?? "",
        message: "message" in command ? command.message : existing?.message,
        status:
          command.status !== undefined
            ? normalizeStatus(command.status)
            : (existing?.status ?? "information"),
        direction: existing?.direction ?? fallbackDirection,
        pending:
          "pending" in command
            ? Boolean(command.pending)
            : (existing?.pending ?? false),
      };

      if (!existing) return [...prev, nextItem];
      return prev.map((item) => (item.id === command.id ? nextItem : item));
    });

    scheduleTimeout(command.id, nextDuration);
  }, [command, removeNotification, scheduleTimeout]);

  if (items.length === 0) return null;

  return (
    <div className="har-notification">
      {items.map((item, index) => (
        <NotificationItem
          key={item.id}
          item={item}
          index={index}
          total={items.length}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export { normalizeStatus };
export default Notification;
