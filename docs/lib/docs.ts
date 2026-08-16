/**
 * Docs content loader. Frontmatter and heading ids are local helpers
 * (`frontmatter.ts`, `slug.ts`) so we do not depend on gray-matter / github-slugger.
 */
import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "@/lib/frontmatter";
import { Slugger } from "@/lib/slug";

export type { NavItem } from "@/lib/navigation";
export { navigation, getDocCategory } from "@/lib/navigation";

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');

export type DocMeta = {
  slug: string[];
  title: string;
  description?: string;
  href: string;
};

function walk(dir: string, base: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full, [...base, entry.name]));
    } else if (entry.name.endsWith('.mdx')) {
      const name = entry.name.replace(/\.mdx$/, '');
      const slug = name === 'index' ? base : [...base, name];
      files.push(slug.join('/') || 'index');
    }
  }

  return files;
}

export function getDocSlugs(): string[][] {
  return walk(CONTENT_DIR).map((key) =>
    key === 'index' ? [] : key.split('/').filter(Boolean),
  );
}

export function getDocBySlug(slug: string[]): {
  meta: DocMeta;
  content: string;
} {
  const rel =
    slug.length === 0
      ? 'index.mdx'
      : fs.existsSync(path.join(CONTENT_DIR, ...slug) + '.mdx')
        ? `${slug.join('/')}.mdx`
        : path.join(...slug, 'index.mdx');

  const full = path.join(CONTENT_DIR, rel);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = parseFrontmatter(raw);

  return {
    meta: {
      slug,
      title: String(data.title ?? slug.at(-1) ?? 'Docs'),
      description: data.description ? String(data.description) : undefined,
      href: slug.length === 0 ? '/docs' : `/docs/${slug.join('/')}`,
    },
    content,
  };
}

export function extractToc(markdown: string) {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items: { id: string; text: string; level: number }[] = [];
  const slugs = new Slugger();
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown))) {
    const level = match[1].length;
    const text = match[2].replace(/`/g, '').trim();
    const id = slugs.slug(text);
    items.push({ id, text, level });
  }

  return items;
}
