/**
 * HARJS coding conventions — CodeGraph index source.
 *
 * Query this file via `codegraph_explore "CodingConventions"` or
 * `"component body order refs states"`. Do not re-ask the user.
 *
 * Canonical implementations: Button, Select, Modal, Popover, Steps, Kanban.
 * Docs (`docs/components`, `docs/lib`, `docs/app`) follow the same TSX
 * section order and nested CSS. Demo files under `docs/components/demos/`
 * stay presentational; do not churn them just to add empty sections.
 */

/** Component function body section order. Omit a section if it is empty. */
export const COMPONENT_SECTION_ORDER = [
  "refs",
  "states",
  "hooks",
  "variables",
  "methods",
  "useEffects",
] as const;

export type ComponentSection = (typeof COMPONENT_SECTION_ORDER)[number];

/**
 * Section comment labels that MUST appear above each present block.
 *
 * Subsections: `// states -> Columns`, `// methods -> Alias Panel`,
 * `// variables -> Class names`.
 */
export const COMPONENT_SECTION_COMMENTS: Record<ComponentSection, string> = {
  refs: "// refs",
  states: "// states",
  hooks: "// hooks",
  variables: "// variables",
  methods: "// methods",
  useEffects: "// useEffects",
};

/**
 * What belongs in each section.
 *
 * - refs: `useRef` and className arrays (`_buttonClassName`, `_modal`).
 *   Underscore prefix. Arrays are `string[]`, filled with `Utils.GetClassName`,
 *   joined as `_name.map((c) => c).join(" ")`.
 * - states: `useState` only.
 * - hooks: `useId`, `useImperativeHandle`, `useTranslation`, `useValidation`,
 *   custom hooks. Not `useState` / `useRef`.
 * - variables: derived values (`isControlled`, `keepMounted`). Values needed
 *   to init state stay above `// states`.
 * - methods: handlers (`handleKeys`, `handleClickOutSide`). `useCallback`
 *   wrappers stay here. Prefer IIFE for optional callbacks:
 *   `(() => attributes.onClick && attributes.onClick(event))()`.
 * - useEffects: every `useEffect` / `useLayoutEffect`. Comment sits
 *   immediately above the first one.
 *
 * Helpers that are not hooks live above the component.
 * Add short Turkish WHY comments for non-obvious logic
 * (`// Disabled gelmesi durumunda işlem yapmasına izin verme...`).
 * Set `displayName` on every component.
 */
export const COMPONENT_SECTION_RULES = COMPONENT_SECTION_COMMENTS;

/**
 * CSS nesting rules for `src/assets/css` and `docs/app/globals.css`.
 *
 * - One root per file (library): `.har-<component>` or `.har-<component>-wrapper`.
 * - Docs chrome roots: `.docs-root`, `.shell`, `.example`, `.prose`, `.landing`.
 * - Direct children: `> .header`, `> .content`.
 * - Self modifiers: `&.opened`, `&.filled`, `&.is-ready`.
 * - Nest descendants under the parent they belong to.
 * - `styles.css` only `@import`s siblings then the root. No flat selectors
 *   next to the root.
 * - Tokens: `var(--space-*)`, `var(--radius-*)`, `var(--gray-*)`, `var(--stroke-*)`.
 * - Do not nest `src/assets/css/core/*` token files.
 * - Do not hand-edit `css.cjs` generated color/size/radius output except
 *   to keep the generator templates nested.
 */
export const CSS_NESTING_RULES = {
  root: ".har-<component>",
  docsRoot: ".docs-root",
  child: ">",
  modifier: "&",
} as const;

/**
 * Docs site (`docs/`) — keep the stack small.
 *
 * MDX: `next-mdx-remote` + `remark-gfm`. Live TSX compile: `sucrase`.
 * Do not re-add gray-matter, github-slugger, rehype-slug, rehype-pretty-code,
 * rehype-autolink-headings, or shiki. Frontmatter, heading ids, and code
 * highlight live in `docs/lib/frontmatter.ts`, `docs/lib/slug.ts`,
 * and `Typography.Code` (`src/components/data-display/typography/code`).
 * Docs re-export the tokenizer from `docs/lib/highlight.ts`.
 *
 * Examples: demo files in `docs/components/demos/` are the single source.
 * Register in `docs/components/mdx.tsx`. MDX uses `<Example><ButtonBasic /></Example>`.
 */
export const DOCS_STACK = {
  mdx: "next-mdx-remote",
  gfm: "remark-gfm",
  liveCompile: "sucrase",
  frontmatter: "docs/lib/frontmatter.ts",
  slug: "docs/lib/slug.ts",
  highlight: "src/components/data-display/typography/code/highlight.ts",
} as const;

/** Shared prop mixins. Do not invent parallel variant types. */
export const SHARED_PROP_MIXINS = [
  "IVariantProps",
  "IIconProps",
  "IStatusProps",
  "IBorderProps",
  "IColorProps",
  "ISizeProps",
] as const;
