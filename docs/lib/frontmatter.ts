/**
 * Tiny YAML-ish frontmatter parser. Docs only use `key: value` strings
 * between `---` fences — no nested objects, lists, or gray-matter.
 */
export function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  if (!raw.startsWith("---")) {
    return { data: {}, content: raw };
  }

  const end = raw.indexOf("\n---", 3);
  if (end < 0) {
    return { data: {}, content: raw };
  }

  const yaml = raw.slice(4, end).trim();
  // `---` satırından sonraki gövde; baştaki boş satırı at.
  const content = raw.slice(end + 4).replace(/^\r?\n/, "");
  const data: Record<string, string> = {};

  for (const line of yaml.split("\n")) {
    const colon = line.indexOf(":");
    if (colon < 0) continue;

    const key = line.slice(0, colon).trim();
    if (!key) continue;

    let value = line.slice(colon + 1).trim();
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content };
}
