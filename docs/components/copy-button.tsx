"use client";

import { useState, type HTMLAttributes, type ReactNode } from "react";
import { Typography } from "@/lib/ui";

const { Code } = Typography;

type CopyButtonProps = {
  text?: string;
  getText?: () => string;
  label?: string;
  className?: string;
};

function childrenToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(childrenToText).join("");
  if (typeof node === "object" && "props" in node) {
    return childrenToText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function languageFromClassName(className?: string) {
  const match = className?.match(/language-([\w-]+)/);
  return match?.[1] ?? "tsx";
}

export function CopyButton({
  text = "",
  getText,
  label = "Copy code",
  className = "code-copy",
}: CopyButtonProps) {
  // states
  const [copied, setCopied] = useState(false);

  // methods
  async function copy() {
    const value = (getText ? getText() : text).trim();
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard izni yoksa sessizce geç */
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={copy}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

CopyButton.displayName = "CopyButton";

export function CodeBlock({
  children,
  className,
}: HTMLAttributes<HTMLPreElement>) {
  // variables
  const child = Array.isArray(children) ? children[0] : children;
  const childClassName =
    child && typeof child === "object" && "props" in child
      ? String((child as { props: { className?: string } }).props.className ?? "")
      : "";
  const lang = languageFromClassName(`${className ?? ""} ${childClassName}`);
  const text = childrenToText(children);

  return (
    <div className="prose-code">
      <Code lang={lang} className={className}>
        {text}
      </Code>
      <CopyButton text={text} />
    </div>
  );
}

CodeBlock.displayName = "CodeBlock";
