/**
 * GitHub-style heading ids. Replaces `github-slugger` + `rehype-slug`.
 * `extractToc` and the rehype plugin must share this so hash links match.
 */

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export class Slugger {
  private seen = new Map<string, number>();

  slug(text: string) {
    const base = slugify(text) || "section";
    const count = this.seen.get(base) ?? 0;
    this.seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  }
}

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function walk(node: HastNode, visit: (node: HastNode) => void) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

/** Adds `id` on h1–h6. Duplicate titles get `-1`, `-2`, … like GitHub. */
export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const slugs = new Slugger();

    walk(tree, (node) => {
      if (node.type !== "element" || !node.tagName) return;
      if (!/^h[1-6]$/.test(node.tagName)) return;

      node.properties = node.properties ?? {};
      if (typeof node.properties.id === "string" && node.properties.id) return;

      node.properties.id = slugs.slug(textOf(node));
    });
  };
}
