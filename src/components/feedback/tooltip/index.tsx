"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import IProps from "./IProps";
import ReactDOM from "react-dom";
import "../../../assets/css/components/feedback/tooltip/styles.css";

const Tooltip: React.FC<IProps> = ({ children, text, direction = "top" }) => {
  // refs
  const _arTooltip = useRef<HTMLDivElement>(null);
  const _children = useRef<HTMLDivElement>(null);

  // states
  const [mouseEnter, setMouseEnter] = useState<boolean>(false);
  const [_direction, setDirection] = useState<string>(direction);

  // 💡 Donma ve sonsuz döngüyü engellemek için dışarıdan seçilen ana yönü bir ref'te saklıyoruz
  const currentInitialDirection = useRef<string>(direction);

  useEffect(() => {
    currentInitialDirection.current = direction;
    setDirection(direction); // Storybook panelinden elle yön değiştiğinde senkronize et
  }, [direction]);

  // methods
  const handlePosition = useCallback(() => {
    const child = _children.current;
    const tooltip = _arTooltip.current;

    if (!child || !tooltip) return;

    const margin = 17.5;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const childRect = child.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const spaceTop = childRect.top;
    const spaceBottom = windowHeight - childRect.bottom;
    const spaceLeft = childRect.left;
    const spaceRight = windowWidth - childRect.right;

    // 💡 Hesaplamaya state'ten değil, doğrudan orijinal seçilen yönden başlıyoruz
    let finalDirection = currentInitialDirection.current;

    // Sıkışma durumlarına göre yönü dinamik değiştir
    if (finalDirection === "top" && spaceTop < tooltipRect.height + margin) {
      finalDirection = "bottom";
    } else if (finalDirection === "bottom" && spaceBottom < tooltipRect.height + margin) {
      finalDirection = "top";
    } else if (finalDirection === "left" && spaceLeft < tooltipRect.width + margin) {
      finalDirection = "right";
    } else if (finalDirection === "right" && spaceRight < tooltipRect.width + margin) {
      finalDirection = "left";
    }

    // Eğer hala hiçbir yere sığmıyorsa en geniş boşluğu bul
    const maxSpace = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);
    if (
      (finalDirection === "top" && spaceTop < tooltipRect.height + margin) ||
      (finalDirection === "bottom" && spaceBottom < tooltipRect.height + margin) ||
      (finalDirection === "left" && spaceLeft < tooltipRect.width + margin) ||
      (finalDirection === "right" && spaceRight < tooltipRect.width + margin)
    ) {
      if (maxSpace === spaceTop) finalDirection = "top";
      else if (maxSpace === spaceBottom) finalDirection = "bottom";
      else if (maxSpace === spaceLeft) finalDirection = "left";
      else if (maxSpace === spaceRight) finalDirection = "right";
    }

    let top = 0;
    let left = 0;

    switch (finalDirection) {
      case "top":
        top = childRect.top - tooltipRect.height - margin;
        left = childRect.left + childRect.width / 2 - tooltipRect.width / 2;
        break;
      case "right":
        top = childRect.top + childRect.height / 2 - tooltipRect.height / 2;
        left = childRect.right + margin;
        break;
      case "bottom":
        top = childRect.bottom + margin;
        left = childRect.left + childRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = childRect.top + childRect.height / 2 - tooltipRect.height / 2;
        left = childRect.left - tooltipRect.width - margin;
        break;
    }

    // Ekran taşma koruması
    if (left < 10) left = 10;
    if (left + tooltipRect.width > windowWidth - 10) {
      left = windowWidth - tooltipRect.width - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    // 💡 KRİTİK DEĞİŞİKLİK: Sadece yön gerçekten değiştiyse state güncellenir.
    // Bu kontrol MutationObserver'ın yarattığı kısır döngüyü anında kırar.
    setDirection((prev) => {
      if (prev !== finalDirection) return finalDirection;
      return prev;
    });
  }, []); // Bağımlılık dizisini boş bırakarak fonksiyonun kimliğini sabitliyoruz

  // useEffects
  useEffect(() => {
    window.addEventListener("resize", handlePosition);
    window.addEventListener("scroll", handlePosition, { passive: true });

    const observer = new MutationObserver(() => {
      handlePosition();
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("resize", handlePosition);
      window.removeEventListener("scroll", handlePosition);
      observer.disconnect();
    };
  }, [handlePosition]);

  useEffect(() => {
    if (mouseEnter) setTimeout(() => handlePosition(), 0);
  }, [mouseEnter, handlePosition]);

  return (
    <div className="ar-tooltip-wrapper">
      <div ref={_children} onMouseEnter={() => setMouseEnter(true)} onMouseLeave={() => setMouseEnter(false)}>
        {children}
      </div>

      {mouseEnter &&
        ReactDOM.createPortal(
          <div ref={_arTooltip} className={`ar-tooltip ${_direction}`}>
            {Array.isArray(text) ? (
              text.map((t, index) => (
                <span key={index} className="text">
                  <span className="bullet">&#8226;</span>
                  <span>{t}</span>
                </span>
              ))
            ) : (
              <span className="text">{text}</span>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
