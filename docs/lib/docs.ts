/**
 * Docs content loader. Frontmatter and heading ids are local helpers
 * (`frontmatter.ts`, `slug.ts`) so we do not depend on gray-matter / github-slugger.
 */
import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "@/lib/frontmatter";
import { Slugger } from "@/lib/slug";

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');

export type DocMeta = {
  slug: string[];
  title: string;
  description?: string;
  href: string;
};

export type NavItem =
  | { type: 'link'; title: string; href: string }
  | { type: 'group'; title: string; items: { title: string; href: string }[] };

function componentLinks(
  group: string,
  items: { title: string; slug: string }[],
): NavItem {
  return {
    type: 'group',
    title: group,
    items: items.map((item) => ({
      title: item.title,
      href: `/docs/components/${item.slug}`,
    })),
  };
}

export const navigation: NavItem[] = [
  { type: 'link', title: 'Getting Started', href: '/docs' },
  componentLinks('Form', [
    { title: 'Button', slug: 'form/button' },
    { title: 'Checkbox', slug: 'form/checkbox' },
    { title: 'Date Picker', slug: 'form/date-picker' },
    { title: 'Input', slug: 'form/input' },
    { title: 'Radio', slug: 'form/radio' },
    { title: 'Select', slug: 'form/select' },
    { title: 'Switch', slug: 'form/switch' },
    { title: 'Text Editor', slug: 'form/text-editor' },
    { title: 'Upload', slug: 'form/upload' },
  ]),
  componentLinks('Data Display', [
    { title: 'Card', slug: 'data-display/card' },
    { title: 'Chip', slug: 'data-display/chip' },
    { title: 'Diagram', slug: 'data-display/diagram' },
    { title: 'Divider', slug: 'data-display/divider' },
    { title: 'DnD', slug: 'data-display/dnd' },
    { title: 'Kanban Board', slug: 'data-display/kanban-board' },
    { title: 'Paper', slug: 'data-display/paper' },
    { title: 'Table', slug: 'data-display/table' },
    { title: 'Tabs', slug: 'data-display/tabs' },
    { title: 'Typography', slug: 'data-display/typography' },
  ]),
  componentLinks('Feedback', [
    { title: 'Alert', slug: 'feedback/alert' },
    { title: 'Drawer', slug: 'feedback/drawer' },
    { title: 'Loading', slug: 'feedback/loading' },
    { title: 'Modal', slug: 'feedback/modal' },
    { title: 'Notification', slug: 'feedback/notification' },
    { title: 'Popover', slug: 'feedback/popover' },
    { title: 'Popup Confirm', slug: 'feedback/popup-confirm' },
    { title: 'Progress', slug: 'feedback/progress' },
    { title: 'Spinner', slug: 'feedback/spinner' },
    { title: 'Tooltip', slug: 'feedback/tooltip' },
  ]),
  componentLinks('Navigation', [
    { title: 'Breadcrumb', slug: 'navigation/breadcrumb' },
    { title: 'Menu', slug: 'navigation/menu' },
    { title: 'Pagination', slug: 'navigation/pagination' },
    { title: 'Steps', slug: 'navigation/steps' },
    { title: 'Wizard', slug: 'navigation/wizard' },
  ]),
  componentLinks('Layout', [
    { title: 'Grid System', slug: 'layout/grid-system' },
    { title: 'Layout', slug: 'layout/layout' },
  ]),
];

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

const CATEGORY_LABELS: Record<string, string> = {
  form: 'Form',
  'data-display': 'Data Display',
  feedback: 'Feedback',
  navigation: 'Navigation',
  charts: 'Charts',
  layout: 'Layout',
};

export function getDocCategory(href: string): string | null {
  const match = href.match(/^\/docs\/components\/([^/]+)/);
  if (!match) return null;
  return CATEGORY_LABELS[match[1]] ?? match[1];
}
