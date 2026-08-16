"use client";

import {
  Component,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { highlightDocument } from "@/lib/highlight";
import { compileLiveDemo } from "@/lib/live-demo";

export function ExampleView({
  children,
  code,
  name,
  lang = "tsx",
}: {
  children: ReactNode;
  code: string;
  name?: string;
  lang?: string;
}) {
  const initial = code.trim();

  // states
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [Preview, setPreview] = useState<ComponentType | null>(null);

  // methods
  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard izni yoksa sessizce geç */
    }
  }

  // useEffects
  useEffect(() => {
    setSource(initial);
    setPreview(null);
    setError(null);
  }, [initial]);

  useEffect(() => {
    // Kaynak dosyayla aynıysa derleme yok; MDX'deki hazır preview kalsın.
    if (source === initial) {
      setPreview(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      compileLiveDemo(source, name)
        .then((NextPreview) => {
          if (cancelled) return;
          setPreview(() => NextPreview);
          setError(null);
        })
        .catch((caught: unknown) => {
          if (cancelled) return;
          setError(caught instanceof Error ? caught.message : "Could not compile this example.");
        });
    }, 140);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [source, initial, name]);

  return (
    <div className="example" data-open={open}>
      <div className="preview">
        <PreviewBoundary resetKey={source}>{Preview ? <Preview /> : children}</PreviewBoundary>
        {error ? <div className="example-live-error">{error}</div> : null}
      </div>

      <div className="example-toolbar">
        <button
          type="button"
          className="example-icon-button"
          aria-expanded={open}
          aria-label={open ? "Hide code" : "Show code"}
          data-active={open}
          onClick={() => setOpen((value) => !value)}
        >
          <CodeIcon />
          Code
        </button>
      </div>

      {open ? (
        <div className="example-code-panel">
          <div className="example-code-header">
            <span className="example-lang">{lang}</span>
            <button
              type="button"
              className="example-copy"
              onClick={copy}
              aria-label={copied ? "Copied" : "Copy code"}
            >
              {copied ? (
                <>
                  <CheckIcon />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon />
                  Copy
                </>
              )}
            </button>
          </div>

          <LiveEditor lang={lang} value={source} onChange={setSource} />

          <button type="button" className="example-hide" onClick={() => setOpen(false)} aria-label="Hide code">
            Hide
            <HideIcon />
          </button>
        </div>
      ) : null}
    </div>
  );
}

ExampleView.displayName = "ExampleView";

function LiveEditor({
  value,
  lang,
  onChange,
}: {
  value: string;
  lang: string;
  onChange: (next: string) => void;
}) {
  // refs
  const _highlight = useRef<HTMLDivElement>(null);
  const _textarea = useRef<HTMLTextAreaElement>(null);

  // variables
  const html = highlightDocument(value, lang);

  // methods
  function syncScroll() {
    const textarea = _textarea.current;
    const highlight = _highlight.current;
    if (!textarea || !highlight) return;
    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Tab") return;

    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    onChange(`${value.slice(0, start)}  ${value.slice(end)}`);

    window.requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    });
  }

  return (
    <div className="example-editor">
      <div ref={_highlight} className="example-editor-highlight" aria-hidden>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <textarea
        ref={_textarea}
        className="example-editor-input"
        value={value}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        aria-label="Example code"
        onChange={(event) => onChange(event.target.value)}
        onScroll={syncScroll}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

LiveEditor.displayName = "LiveEditor";

class PreviewBoundary extends Component<{ children: ReactNode; resetKey: string }, { error: string | null }> {
  state = { error: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return <div className="example-live-error">{this.state.error}</div>;
    }

    return this.props.children;
  }
}

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 4 2 8l4 4M10 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HideIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 10.5 8 5.5l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
