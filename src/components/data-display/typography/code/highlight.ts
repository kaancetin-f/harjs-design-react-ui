/**
 * TSX / HTML / JSON / shell highlighter for `Typography.Code`.
 * Extra languages: `Code.registerHighlighter("python", fn)`.
 * Docs overlay imports this file so the textarea stays character-aligned.
 */

const KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "infer",
  "instanceof",
  "interface",
  "keyof",
  "let",
  "new",
  "null",
  "of",
  "return",
  "satisfies",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function token(kind: string, value: string) {
  return `<span class="tok-${kind}">${escapeHtml(value)}</span>`;
}

function highlightTsx(code: string) {
  let html = "";
  let index = 0;
  // Açık JSX/HTML tag sayısı; çocuk metni type/keyword gibi boyamamak için.
  let jsxDepth = 0;

  const emit = (value: string) => {
    html += escapeHtml(value);
  };

  const peek = (offset = 0) => code[index + offset];

  const readWhile = (pattern: RegExp) => {
    const start = index;
    while (index < code.length && pattern.test(code[index])) index += 1;
    return code.slice(start, index);
  };

  const readString = () => {
    const start = index;
    const quote = code[index];
    index += 1;
    while (index < code.length) {
      const char = code[index];
      if (char === "\\") {
        index += 2;
        continue;
      }
      if (char === quote) {
        index += 1;
        break;
      }
      index += 1;
    }
    html += token("string", code.slice(start, index));
  };

  const readLineComment = () => {
    const start = index;
    index += 2;
    while (index < code.length && code[index] !== "\n") index += 1;
    html += token("comment", code.slice(start, index));
  };

  const readBlockComment = () => {
    const start = index;
    index += 2;
    while (index < code.length && !(code[index] === "*" && peek(1) === "/")) {
      index += 1;
    }
    index = Math.min(code.length, index + 2);
    html += token("comment", code.slice(start, index));
  };

  const readHtmlComment = () => {
    const start = index;
    const end = code.indexOf("-->", index + 4);
    index = end < 0 ? code.length : end + 3;
    html += token("comment", code.slice(start, index));
  };

  const readIdent = () => {
    const start = index;
    index += 1;
    while (index < code.length && /[A-Za-z0-9_$]/.test(code[index])) index += 1;
    const word = code.slice(start, index);
    if (KEYWORDS.has(word)) html += token("keyword", word);
    else if (/^[A-Z]/.test(word)) html += token("type", word);
    else html += token("ident", word);
  };

  const isTagStart = () => {
    if (code[index] !== "<") return false;
    const next = peek(1);
    if (next === "!" && code.startsWith("<!--", index)) return true;
    if (next === "/" || next === ">") return true;
    if (!next || !/[A-Za-z]/.test(next)) return false;

    // `Foo<Bar>` generic; önceki karakter harfse tag değil.
    let prev = index - 1;
    while (prev >= 0 && /[ \t]/.test(code[prev])) prev -= 1;
    if (prev >= 0 && /[A-Za-z0-9_$\])]/.test(code[prev])) return false;
    return true;
  };

  const readJsxTag = () => {
    if (code.startsWith("<!--", index)) {
      readHtmlComment();
      return;
    }

    emit("<");
    index += 1;

    let closing = false;
    let selfClosing = false;

    if (peek() === "/") {
      emit("/");
      index += 1;
      closing = true;
    }

    if (peek() === ">") {
      emit(">");
      index += 1;
      jsxDepth = closing ? Math.max(0, jsxDepth - 1) : jsxDepth + 1;
      return;
    }

    const name = readWhile(/[A-Za-z0-9_$.:-]/);
    if (name) html += token("tag", name);

    while (index < code.length) {
      const char = peek();

      if (char === ">") {
        emit(">");
        index += 1;
        break;
      }

      if (char === "/" && peek(1) === ">") {
        emit("/>");
        index += 2;
        selfClosing = true;
        break;
      }

      if (char === '"' || char === "'") {
        readString();
        continue;
      }

      if (char === "{") {
        readBrace();
        continue;
      }

      if (char && /[A-Za-z_:]/.test(char)) {
        html += token("attr", readWhile(/[A-Za-z0-9_:-]/));
        continue;
      }

      emit(char);
      index += 1;
    }

    if (closing) jsxDepth = Math.max(0, jsxDepth - 1);
    else if (!selfClosing) jsxDepth += 1;
  };

  const readBrace = () => {
    emit("{");
    index += 1;
    let depth = 1;

    while (index < code.length && depth > 0) {
      const char = peek();
      const next = peek(1);

      if (char === "/" && next === "/") {
        readLineComment();
        continue;
      }
      if (char === "/" && next === "*") {
        readBlockComment();
        continue;
      }
      if (char === '"' || char === "'" || char === "`") {
        readString();
        continue;
      }
      if (isTagStart()) {
        readJsxTag();
        continue;
      }
      if (char === "{") {
        emit("{");
        index += 1;
        depth += 1;
        continue;
      }
      if (char === "}") {
        emit("}");
        index += 1;
        depth -= 1;
        continue;
      }
      if (char && /[0-9]/.test(char) && (index === 0 || !/[A-Za-z_$]/.test(code[index - 1]))) {
        html += token("number", readWhile(/[0-9._xXa-fA-F]/));
        continue;
      }
      if (char && /[A-Za-z_$]/.test(char)) {
        readIdent();
        continue;
      }

      emit(char);
      index += 1;
    }
  };

  while (index < code.length) {
    const char = peek();
    const next = peek(1);

    if (char === "/" && next === "/") {
      readLineComment();
      continue;
    }
    if (char === "/" && next === "*") {
      readBlockComment();
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      readString();
      continue;
    }
    if (isTagStart()) {
      readJsxTag();
      continue;
    }

    // Tag çocukları: `Button` yazısı tag adı gibi boyanmasın.
    if (jsxDepth > 0 && char !== "{" && char !== "<") {
      const start = index;
      while (index < code.length && code[index] !== "<" && code[index] !== "{") {
        index += 1;
      }
      emit(code.slice(start, index));
      continue;
    }

    if (char === "{") {
      readBrace();
      continue;
    }
    if (char && /[0-9]/.test(char) && (index === 0 || !/[A-Za-z_$]/.test(code[index - 1]))) {
      html += token("number", readWhile(/[0-9._xXa-fA-F]/));
      continue;
    }
    if (char && /[A-Za-z_$]/.test(char)) {
      readIdent();
      continue;
    }

    emit(char);
    index += 1;
  }

  return html;
}

function highlightShell(code: string) {
  let html = "";
  let index = 0;

  while (index < code.length) {
    const char = code[index];

    if (char === "#") {
      let end = index + 1;
      while (end < code.length && code[end] !== "\n") end += 1;
      html += token("comment", code.slice(index, end));
      index = end;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      const quote = char;
      let end = index + 1;
      while (end < code.length) {
        if (code[end] === "\\") {
          end += 2;
          continue;
        }
        if (code[end] === quote) {
          end += 1;
          break;
        }
        end += 1;
      }
      html += token("string", code.slice(index, end));
      index = end;
      continue;
    }

    html += escapeHtml(char);
    index += 1;
  }

  return html;
}

export type Highlighter = (code: string) => string;

const highlighters: Record<string, Highlighter> = {
  tsx: highlightTsx,
  jsx: highlightTsx,
  ts: highlightTsx,
  typescript: highlightTsx,
  js: highlightTsx,
  javascript: highlightTsx,
  html: highlightTsx,
  xml: highlightTsx,
  json: highlightTsx,
  bash: highlightShell,
  sh: highlightShell,
  shell: highlightShell,
};

/** Add or replace a language tokenizer. Unknown langs fall back to TSX. */
export function registerHighlighter(lang: string, highlighter: Highlighter) {
  highlighters[lang.toLowerCase()] = highlighter;
}

/** Inner HTML of a `<code>` node. Text content equals `code`. */
export function highlightToHtml(code: string, lang = "tsx") {
  const run = highlighters[lang.toLowerCase()] ?? highlightTsx;
  return run(code);
}

/** Full `<pre><code>` document for overlay editors. */
export function highlightDocument(code: string, lang = "tsx") {
  return `<pre class="har-typography-code"><code>${highlightToHtml(code, lang)}</code></pre>`;
}
