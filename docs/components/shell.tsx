"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { DocsLogo } from "@/components/docs-logo";
import { getDocCategory, navigation } from "@/lib/navigation";
import { TableOfContents } from "@/components/table-of-contents";
import { ThemeToggle } from "@/components/theme-toggle";

const SIDEBAR_SCROLL_KEY = "harjs-docs-sidebar-scroll";

function NavIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      {open ? (
        <path
          d="M4 4l10 10M14 4 4 14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 5h12M3 9h12M3 13h12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

NavIcon.displayName = "NavIcon";

function HeaderLinks({ currentPath }: { currentPath: string }) {
  return (
    <>
      <Link href="/docs" data-active={currentPath.startsWith("/docs")}>
        Docs
      </Link>
      <a href="https://www.npmjs.com/package/@harjs/react-ui" target="_blank" rel="noreferrer">
        npm
      </a>
      <a
        href="https://github.com/kaancetin-f/harjs-design-react-ui"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </>
  );
}

HeaderLinks.displayName = "HeaderLinks";

function scrollSidebarToActive(sidebar: HTMLElement): boolean {
  const active = sidebar.querySelector<HTMLElement>(".nav-link[data-active='true']");
  if (!active) {
    try {
      const saved = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
      if (saved) sidebar.scrollTop = Number(saved);
    } catch {
      /* private mode */
    }
    return true;
  }

  // Grid yüksekliği oturmadan scrollTop yazılmaz; caller tekrar dener.
  if (sidebar.scrollHeight <= sidebar.clientHeight + 1) return false;

  const sidebarRect = sidebar.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  sidebar.scrollTop +=
    activeRect.top - sidebarRect.top - sidebar.clientHeight / 2 + activeRect.height / 2;
  return true;
}

export function DocsShell({
  children,
  currentPath,
  toc,
}: {
  children: ReactNode;
  currentPath: string;
  toc?: { id: string; text: string; level: number }[];
}) {
  // refs
  const _sidebar = useRef<HTMLElement>(null);

  // states
  const [navOpen, setNavOpen] = useState(false);

  // variables
  const category = getDocCategory(currentPath);
  const _rootClassName: string[] = ["docs-root"];
  if (navOpen) _rootClassName.push("nav-open");

  // methods
  const closeNav = useCallback(() => setNavOpen(false), []);
  const toggleNav = useCallback(() => setNavOpen((open) => !open), []);

  // useEffects
  useEffect(() => {
    closeNav();
  }, [currentPath, closeNav]);

  useLayoutEffect(() => {
    const sidebar = _sidebar.current;
    if (!sidebar) return;

    let done = false;
    const tryFocus = () => {
      if (done) return;
      if (scrollSidebarToActive(sidebar)) done = true;
    };

    tryFocus();
    const frame = requestAnimationFrame(tryFocus);
    const retry = window.setTimeout(tryFocus, 50);
    const observer = new ResizeObserver(tryFocus);
    observer.observe(sidebar);

    const onScroll = () => {
      try {
        sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebar.scrollTop));
      } catch {
        /* private mode */
      }
    };

    sidebar.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      done = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(retry);
      observer.disconnect();
      sidebar.removeEventListener("scroll", onScroll);
    };
  }, [currentPath, navOpen]);

  useEffect(() => {
    if (!navOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNav();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [navOpen, closeNav]);

  return (
    <div className={_rootClassName.map((c) => c).join(" ")}>
      <header className="docs-header">
        <div className="docs-header-inner">
          <button
            type="button"
            className="docs-nav-toggle"
            aria-expanded={navOpen}
            aria-controls="docs-sidebar"
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            onClick={toggleNav}
          >
            <NavIcon open={navOpen} />
          </button>
          <DocsLogo />

          <div className="docs-header-actions">
            <button type="button" className="docs-search" disabled title="Search coming soon">
              <span>Search docs…</span>
              <kbd>⌘K</kbd>
            </button>
            <ThemeToggle />
            <nav className="docs-header-nav" aria-label="Primary">
              <HeaderLinks currentPath={currentPath} />
            </nav>
          </div>
        </div>
      </header>

      <button
        type="button"
        className="docs-nav-backdrop"
        aria-label="Close navigation"
        tabIndex={navOpen ? 0 : -1}
        onClick={closeNav}
      />

      <div className="shell">
        <aside id="docs-sidebar" className="sidebar" ref={_sidebar}>
          <nav className="nav" aria-label="Documentation">
            <div className="sidebar-links">
              <HeaderLinks currentPath={currentPath} />
            </div>
            {navigation.map((item) => {
              if (item.type === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link"
                    data-active={currentPath === item.href}
                    scroll={false}
                    onClick={closeNav}
                  >
                    {item.title}
                  </Link>
                );
              }

              const groupActive =
                category === item.title ||
                item.items.some((child) => currentPath === child.href);

              return (
                <div key={item.title} className="nav-group" data-active={groupActive}>
                  <p className="nav-group-title">{item.title}</p>
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="nav-link"
                      data-active={currentPath === child.href}
                      scroll={false}
                      onClick={closeNav}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="main-wrap">
          <main className="main">{children}</main>
          {toc && toc.length > 0 ? <TableOfContents items={toc} /> : null}
        </div>
      </div>
    </div>
  );
}

DocsShell.displayName = "DocsShell";
