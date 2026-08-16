"use client";

import React from "react";
import IProps from "./IProps";
import { highlightToHtml, registerHighlighter } from "./highlight";

type CodeComponent = React.FC<IProps> & {
  registerHighlighter: typeof registerHighlighter;
};

const Code: CodeComponent = ({
  children,
  code,
  lang = "tsx",
  highlight,
  className,
  ...attributes
}) => {
  // refs
  const _codeClassName: string[] = ["har-typography-code"];
  if (className) _codeClassName.push(className);

  // variables
  const source = code ?? children ?? "";
  const html = highlight ? highlight(source, lang) : highlightToHtml(source, lang);

  return (
    <pre {...attributes} className={_codeClassName.map((c) => c).join(" ")}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
};

Code.displayName = "Code";
Code.registerHighlighter = registerHighlighter;

export default Code;
