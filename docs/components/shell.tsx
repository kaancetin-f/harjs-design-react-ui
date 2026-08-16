import type { ReactNode } from "react";
import Link from "next/link";
import { DocsLogo } from "@/components/docs-logo";
import { getDocCategory, navigation } from "@/lib/docs";
import { TableOfContents } from "@/components/table-of-contents";
import { ThemeToggle } from "@/components/theme-toggle";

export function DocsShell({
  children,
  currentPath,
  toc,
}: {
  children: ReactNode;
  currentPath: string;
  toc?: { id: string; text: string; level: number }[];
}) {
  // variables
  const category = getDocCategory(currentPath);

  return (
    <div className="docs-root">
      <header className="docs-header">
        <div className="docs-header-inner">
          <DocsLogo />

          <div className="docs-header-actions">
            <button type="button" className="docs-search" disabled title="Search coming soon">
              <span>Search docs…</span>
              <kbd>⌘K</kbd>
            </button>
            <ThemeToggle />
            <nav className="docs-header-nav" aria-label="Primary">
              <Link href="/docs" data-active={currentPath.startsWith("/docs")}>
                Docs
              </Link>
              <a
                href="https://www.npmjs.com/package/@harjs/react-ui"
                target="_blank"
                rel="noreferrer"
              >
                npm
              </a>
              <a
                href="https://github.com/kaancetin-f/harjs-design-react-ui"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="shell">
        <aside className="sidebar">
          <nav className="nav" aria-label="Documentation">
            {navigation.map((item) => {
              if (item.type === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-link"
                    data-active={currentPath === item.href}
                  >
                    {item.title}
                  </Link>
                );
              }

              const groupActive =
                category === item.title ||
                item.items.some((child) => currentPath === child.href);

              return (
                <div
                  key={item.title}
                  className="nav-group"
                  data-active={groupActive}
                >
                  <p className="nav-group-title">{item.title}</p>
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="nav-link"
                      data-active={currentPath === child.href}
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
