"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import IProps from "./IProps";
import "../../../assets/css/components/feedback/notification/notification.css";
import { Direction } from "../../../libs/core/application/contexts/Notification";

const Notification = ({ title, message, status, direction = "bottom-left", trigger }: IProps) => {
  const _firstLoad = useRef<boolean>(false);
  const _notificationItems = useRef<(HTMLDivElement | null)[]>([]);
  const [items, setItems] = useState<
    {
      id: number;
      title: string;
      message?: string;
      status: string | number;
      direction: Direction;
      timeoutId?: NodeJS.Timeout;
    }[]
  >([]);

  // useEffects
  useEffect(() => {
    if (!_firstLoad.current) {
      _firstLoad.current = true;
      return;
    }

    if (typeof status === "number") {
      if (status >= 100 && status < 200) {
        status = "information";
      } else if (status >= 200 && status < 300) {
        status = "success";
      } else if (status >= 300 && status < 400) {
        status = "warning";
      } else if (status >= 400 && status < 500) {
        status = "error";
      } else if (status >= 500 && status < 600) {
        status = "error";
      }
    }

    setItems((prev) => [...prev, { id: Math.random(), title, message, status, direction }]);
  }, [trigger]);

  useEffect(() => {
    let clearTimeoutId: NodeJS.Timeout | undefined = undefined;

    items.forEach((item) => {
      if (!item.timeoutId) {
        const timeoutId = setTimeout(() => {
          clearTimeoutId = item.timeoutId;
          setItems((prev) => prev.filter((_item) => _item.id !== item.id));
        }, 3000);

        // Öncesinde timeoutId değerinin tanımlanması yapılıyor.
        setItems((prev) => prev.map((prevItem) => (prevItem.id === item.id ? { ...prevItem, timeoutId } : prevItem)));
      }
    });

    return () => {
      if (items.length === 0) return;

      const item = items.find((x) => x.timeoutId == clearTimeoutId);

      if (item) {
        clearTimeout(item.timeoutId);
        clearTimeoutId = undefined;
      }
    };
  }, [items]);

  const getBottomPosition = (index: number): number => {
    let bottom: number = 30; // Başlangıçta 30px'lik bir boşluk ekliyoruz.

    // Önceki öğenin yüksekliğini dikkate alarak bottom hesaplanıyor.
    if (_notificationItems.current[index - 1]) {
      bottom = _notificationItems.current.slice(0, index).reduce((acc, el) => {
        const rect = el!.getBoundingClientRect();

        return acc + rect.height + 20; // +20 değeri ara boşluğu arttırıyor.
      }, 30); // 30px'lik boşluğu başlangıçta ekliyoruz.
    }

    return bottom;
  };

  return items.map((item, index) => {
    const bottom = getBottomPosition(index);

    return (
      <div
        key={item.id}
        ref={(element) => {
          if (!element) return;

          _notificationItems.current[index] = element;
        }}
        className="ar-notification-item"
        style={
          items.length > 5
            ? {
                backgroundColor: `rgba(var(--white-rgb), ${index === items.length - 1 ? 1 : 0.1})`,
                backdropFilter: "blur(10px)",
                bottom: (index === 0 ? 30 : 10) * (index + 1),
              }
            : { bottom }
        }
      >
        <div className="icon">
          <span className={String(item.status)}></span>
          <span className={String(item.status)}></span>
          <span className={String(item.status)}></span>
          <span className={String(item.status)}></span>
          <span className={String(item.status)}></span>
        </div>

        <div className="content">
          <span className="title">{item.title}</span>
          <span className="message">{item.message}</span>
        </div>

        <div
          className="close"
          onClick={() => {
            if (item.timeoutId) clearTimeout(item.timeoutId);

            setItems((prev) => prev.filter((_item) => _item.id !== item.id));
          }}
        ></div>
      </div>
    );
  });
};

export default Notification;
