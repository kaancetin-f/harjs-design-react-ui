# PROJECT_MAP

This document maps the actual structure of the repo so that AI can understand it at "first glance"[cite: 12]. Code accuracy takes precedence over documentation[cite: 12].

## Root

- `src/` : library source (React/Next UI components + internal libs)[cite: 12]
- `docs/` : documentation site (MDX + demo pages)[cite: 12]
- `dist/` : build output[cite: 12]
- `package.json` : package metadata + build scripts + `exports` mapping[cite: 12]

## Major Directories

### Components

- `src/components/`[cite: 12]
  - Category-based folders and component folders[cite: 12]
  - Pattern (observed in practice):[cite: 12]
    - `src/components/<category>/<component>/index.tsx` -> public component default export[cite: 12]
    - `src/components/<category>/<component>/IProps.ts` or `Props.ts` -> props type[cite: 12]
    - `src/components/<category>/<component>/helpers.ts` -> helper logic (if present)[cite: 12]

Example component locations:[cite: 12]

- `src/components/form/button/`[cite: 12]
- `src/components/form/select/`[cite: 12]
- `src/components/form/date-picker/`[cite: 12]
- `src/components/form/upload/`[cite: 12]
- `src/components/feedback/modal/`[cite: 12]
- `src/components/feedback/popover/`[cite: 12]
- `src/components/feedback/tooltip/`[cite: 12]
- `src/components/navigation/steps/`[cite: 12]
- `src/components/navigation/pagination/`[cite: 12]
- `src/components/data-display/table/`[cite: 12]
- `src/components/data-display/kanban-board/`[cite: 12]

### Hooks + Providers / Context

- `src/libs/core/application/contexts/`[cite: 12]
  - `Config.tsx` -> `ConfigProvider`[cite: 12]
  - `Loading.tsx` -> `LoadingProvider`[cite: 12]
  - `Notification.tsx` -> `NotificationProvider`[cite: 12]
- `src/libs/core/application/hooks/`[cite: 12]
  - `useConfirm.ts`[cite: 12]
  - `useValidation.ts`[cite: 12]
  - `useNotification.ts`[cite: 12]
  - hook barrel: `src/libs/core/application/hooks/index.ts`[cite: 12]

### Infrastructure (Types, Enums, Utilities)

- `src/libs/infrastructure/shared/`[cite: 12]
  - `Utils.ts` (className builder, DeepEqual, IsNullOrEmpty…)[cite: 12]
  - `DATE.ts` (date formatting/parsing helpers)[cite: 12]
  - `Enums.ts` (FilterOperator, SessionStorage, DispatchEvent)[cite: 12]
  - `CodingConventions.ts` (TSX body order + docs deps)[cite: 12]
  - also shared constants[cite: 12]
- `src/libs/infrastructure/types/`[cite: 12]
  - `index.ts` : design tokens + component-friendly model/types[cite: 12]
  - `IGlobalProps.ts` : common prop mixins[cite: 12]

### Styling System

- Global token CSS:[cite: 12]
  - `src/index.ts` -> `import "./assets/css/core/har-core.css";`[cite: 12]
- Component CSS:[cite: 12]
  - `import "../../../assets/css/components/**/styles.css"` inside `src/components/**/index.tsx`[cite: 12]
- Core CSS root files:[cite: 12]
  - `src/assets/css/core/*` (color/space/radius/stroke/utils/animation…)[cite: 12]

### Tests

- Helper unit tests:[cite: 12]
  - e.g., `src/components/navigation/pagination/helpers.test.ts`[cite: 12]
  - e.g., `src/components/navigation/steps/helpers.test.ts`[cite: 12]

React renderer test infrastructure does not exist in the repo; primary assurance is "build + typecheck + compat smoke test"[cite: 12].

### Stories / Demos

- `docs/components/demos/**`[cite: 12]
- MDX -> demo component map inside `docs/components/mdx.tsx`[cite: 12]
  - e.g., Demo exports like `ModalBasic`, `TooltipBasic`, `StepsBasic` are registered here[cite: 12].

## Public Entry Points / Exports

- Main entry of the library:[cite: 12]
  - `src/index.ts`[cite: 12]
- Qualified sub-entries (package `exports` mapping):[cite: 12]
  - `./config` -> `dist/libs/core/application/contexts/index.*`[cite: 12]
  - `./hooks` -> `dist/libs/core/application/hooks/index.*`[cite: 12]
  - `./types` -> `dist/libs/infrastructure/types/index.*`[cite: 12]
  - `./utils` -> `dist/libs/infrastructure/shared/index.*`[cite: 12]
  - `./styles.css` -> `dist/styles.css`[cite: 12]

Reference:[cite: 12]

- `package.json` `exports` section[cite: 12]
