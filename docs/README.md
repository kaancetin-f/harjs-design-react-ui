# @harjs/react-ui docs

Custom documentation site — **Next.js + MDX only** (no Fumadocs / Nextra).

## Run

```bash
npm run docs:dev
```

Open http://localhost:3001

## Structure

| Path | Role |
|------|------|
| `content/docs/**/*.mdx` | Pages |
| `content/docs/components/<folder>/` | Mirrors `src/components/<folder>/` |
| `lib/docs.ts` | File loader + nav + TOC |
| `components/shell.tsx` | Layout chrome |
| `components/demos/<category>/<component>/` | Live previews, mirroring `src/components/` |
| `app/globals.css` | Design system |

Sidebar groups match source folders: **Form**, **Data Display**, **Feedback**, **Navigation**, **Layout**.

## Add a component page

1. Write `content/docs/components/<folder>/<name>.mdx`
2. Add demos in `components/demos/<category>/<component>/`
3. Register them in `components/mdx.tsx`
4. Confirm the nav entry in `lib/docs.ts` → `navigation`
