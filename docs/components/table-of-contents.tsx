"use client";

import { useEffect, useState, type MouseEvent } from "react";

type TocItem = { id: string; text: string; level: number };

export function TableOfContents({ items }: { items: TocItem[] }) {
  // states
  const [activeIds, setActiveIds] = useState<string[]>(
    items[0]?.id ? [items[0].id] : [],
  );

  // methods
  function scrollToHeading(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }

  // useEffects
  useEffect(() => {
    if (items.length === 0) return;

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headingElements.length === 0) return;

    // Görünen başlıkları tut; birden fazla kesişince hepsini aktif işaretle.
    const visible = new Map<string, IntersectionObserverEntry>();

    const paintVisible = () => {
      const intersecting = items
        .map((item) => visible.get(item.id))
        .filter(
          (entry): entry is IntersectionObserverEntry =>
            Boolean(entry?.isIntersecting),
        )
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .map((entry) => entry.target.id);

      if (intersecting.length > 0) {
        setActiveIds(intersecting);
        return;
      }

      const marker = 120;
      let current = items[0].id;
      for (const el of headingElements) {
        if (el.getBoundingClientRect().top <= marker) {
          current = el.id;
        }
      }
      setActiveIds([current]);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry);
        }
        paintVisible();
      },
      {
        rootMargin: "-56px 0px 0px 0px",
        threshold: [0, 1],
      },
    );

    for (const el of headingElements) observer.observe(el);

    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && items.some((item) => item.id === hash)) {
        setActiveIds((prev) => (prev.includes(hash) ? prev : [...prev, hash]));
      }
    };

    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [items]);

  return (
    <aside className="toc" aria-label="On this page">
      <p className="toc-title">On this page</p>
      <ul className="toc-list">
        {items.map((item) => (
          <li key={item.id} data-level={item.level}>
            <a
              href={`#${item.id}`}
              data-active={activeIds.includes(item.id)}
              onClick={(event) => scrollToHeading(event, item.id)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

TableOfContents.displayName = "TableOfContents";
