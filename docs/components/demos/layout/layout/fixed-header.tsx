"use client";

import { LayoutDemoFrame, LayoutShell } from "@/components/demos/layout/layout/shell";

const paragraphs = Array.from({ length: 18 }, (_, index) => index + 1);

export function LayoutFixedHeader() {
  return (
    <LayoutDemoFrame height={360}>
      <LayoutShell
        name="docs-layout-fixed-header"
        stickyHeader
        stickySider={false}
        section={
          <div>
            <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.5 }}>
              Sticky header stays visible while the section scrolls.
            </p>
            {paragraphs.map((item) => (
              <p key={item} style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.6, color: "var(--gray-600)" }}>
                Block {item}. Long content to demonstrate a fixed header over a scrolling workspace.
              </p>
            ))}
          </div>
        }
      />
    </LayoutDemoFrame>
  );
}
