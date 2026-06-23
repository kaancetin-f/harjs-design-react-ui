"use client";

import React, { useEffect, useRef, useState } from "react";
import Parser from "./classes/Parser";
import Compiler from "./classes/Compiler";
import "../../../assets/css/components/data-display/syntax-highlighter/syntax-highlighter.css";
import Import from "./Import";
// import Button from "../../form/button";

const SyntaxHighlighter: React.FC<{
  children: React.ReactNode;
  position?: "left" | "center" | "right";
}> & {
  Import: React.FC<{ children: string }>;
} = ({ children, position = "left" }) => {
  // refs
  const _div = useRef<HTMLDivElement>(null);

  // states
  const [elements, setElements] = useState<string[]>([]);
  const [htmlContent, setHtmlContent] = useState<string>("");
  // const [codePanelIsOpen, setCodePanelIsOpen] = useState<boolean>(false);

  // classes
  const parser = new Parser(setElements);
  const compiler = new Compiler(setHtmlContent);

  // useEffects
  useEffect(() => {
    // Clear...
    setElements([]);
    // Fill...
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        parser.JsxToString(child);
      }
    });
  }, [children]);

  useEffect(() => {
    if (elements.length === 0) return;

    compiler.Jsx(elements);
  }, [elements]);

  return (
    <React.Fragment>
      <div className="ar-syntax">
        <div ref={_div} className={`preview ${position}`}>
          {children}
        </div>

        {/* <div className="ar-syntax-button-group">
          <Button
            variant="outlined"
            color="dark"
            size="small"
            onClick={() => setCodePanelIsOpen((x) => !x)}
          >
            {codePanelIsOpen ? "Close Code" : "Open Code"}
          </Button>
        </div> */}

        {/* <pre className={`pre ${!codePanelIsOpen ? "hidden" : "visible"}`}> */}
        <pre className="pre">
          <code dangerouslySetInnerHTML={{ __html: htmlContent }}></code>
        </pre>
      </div>
    </React.Fragment>
  );
};

SyntaxHighlighter.Import = Import;

export default SyntaxHighlighter;
