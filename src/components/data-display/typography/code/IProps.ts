import type { HTMLAttributes } from "react";

interface IProps extends Omit<HTMLAttributes<HTMLPreElement>, "children"> {
  /** Source to highlight. Takes precedence over `children`. */
  code?: string;
  /** Language key. Built-in: tsx, js, html, json, bash. Extend via `registerHighlighter`. */
  lang?: string;
  /** Per-instance tokenizer. Overrides the registered language highlighter. */
  highlight?: (code: string, lang: string) => string;
  children?: string;
}

export default IProps;
