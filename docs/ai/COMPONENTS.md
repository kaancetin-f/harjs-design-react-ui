# COMPONENTS

This page summarizes the component system in the repo in "rule" format[cite: 9].

## Component Folder Structure

- `src/components/<category>/<component>/`[cite: 9]
  - `index.tsx` : public default export component[cite: 9]
  - `IProps.ts` or `Props.ts` : props contract[cite: 9]
  - `helpers.ts` / `position.ts` : logic & overlay positioning (if present)[cite: 9]
  - `assets/css/components/**/styles.css` import:[cite: 9]
    - located inside the component (e.g., `src/components/form/select/index.tsx`)[cite: 9]

Example references:[cite: 9]

- `src/components/form/button/`[cite: 9]
- `src/components/form/input/` (compound)[cite: 9]
- `src/components/form/select/`[cite: 9]
- `src/components/form/date-picker/`[cite: 9]
- `src/components/form/upload/`[cite: 9]
- `src/components/feedback/modal/`[cite: 9]
- `src/components/feedback/popover/`[cite: 9]
- `src/components/feedback/tooltip/`[cite: 9]
- `src/components/navigation/steps/`[cite: 9]
- `src/components/data-display/table/`[cite: 9]
- `src/components/data-display/kanban-board/`[cite: 9]

## Export Pattern

### Default Export

- Most components:[cite: 9]
  - `export default <Component>` inside `index.tsx`[cite: 9]

Example:[cite: 9]

- `src/components/feedback/modal/index.tsx`[cite: 9]
- `src/components/feedback/tooltip/index.tsx`[cite: 9]

### Compound Component Attachment (Static Properties)

This repo uses the compound attachment approach[cite: 9].

- Button:[cite: 9]
  - Base: `src/components/form/button/Button.tsx`[cite: 9]
  - Wrapper/attach: `src/components/form/button/index.tsx` (`Button.Group = ...`)[cite: 9]
  - Reference: `src/components/form/button/index.tsx`[cite: 9]

- Input:[cite: 9]
  - Base: `src/components/form/input/index.tsx` (forwardRef)[cite: 9]
  - Attach:[cite: 9]
    - `Input.AddonBefore`, `Input.AddonAfter`, `Input.Icon`, `Input.Decimal`, `Input.Pin`...[cite: 9]
  - Reference: `src/components/form/input/index.tsx`[cite: 9]

Rule:[cite: 9]

- When requesting a new compound component: attach children as static properties[cite: 9].
- Stick to the repo's existing `static property` pattern instead of inventing a "React.Context compound"[cite: 9].

## Variants / Status / Colors / Borders / Sizes

- Shared prop mixins are provided via `src/libs/infrastructure/types/IGlobalProps.ts`:[cite: 9]
  - `IVariantProps`, `IStatusProps`, `IColorProps`, `IBorderProps`, `IIconProps`, `ISizeProps`, `IUpperCaseProps`[cite: 9]
- Token unions are defined inside `src/libs/infrastructure/types/index.ts`:[cite: 9]
  - `Variants`, `Status`, `Color`, `Sizes`, `BorderRadiuses`[cite: 9]

## Controlled / Uncontrolled Patterns

### Modal (Controlled via open.get/set)

- The `open` prop is defined as a "getter/setter" rather than a boolean:[cite: 9]
  - `src/components/feedback/modal/IProps.ts`[cite: 9]
- Internal state is used solely for animation and UI details like mounted/entered/exited[cite: 9].

### Select (Controlled via value + union props)

- `multiple: true` => `value: Option[]`, `onChange: (Option[]) => void`[cite: 9]
- `multiple?: false` => `value: Option | undefined`[cite: 9]
  - `src/components/form/select/Props.ts`[cite: 9]

### Steps (Controlled vs Internal)

- Controlled if `currentStep` is a number[cite: 9]
- Otherwise:[cite: 9]
  - Persisted with sessionStorage if `config.isAutomatic` is not present[cite: 9]
  - `src/components/navigation/steps/index.tsx`[cite: 9]

### Table (Parent-owned Pagination + Imperative Ref)

- If the `pagination` prop is present, parent state drives it:[cite: 9]
  - `src/components/data-display/table/index.tsx`[cite: 9]
- Also via `forwardRef`:[cite: 9]
  - Exposes imperative methods like `filterCleaner`[cite: 9]
  - `src/components/data-display/table/index.tsx`[cite: 9]

## Ref Forwarding

- `Table` (forwardRef):[cite: 9]
  - `src/components/data-display/table/index.tsx`[cite: 9]
- `Input` (forwardRef):[cite: 9]
  - `src/components/form/input/index.tsx`[cite: 9]

## Accessibility Patterns (Overlay)

- In overlay components:[cite: 9]
  - `role="dialog"` / `aria-modal`[cite: 9]
  - ESC closure + focus restore[cite: 9]
  - Tab trap (Modal/Popover)[cite: 9]

Example references:[cite: 9]

- Modal:[cite: 9]
  - `src/components/feedback/modal/index.tsx`[cite: 9]
- Popover:[cite: 9]
  - `src/components/feedback/popover/index.tsx`[cite: 9]
- Tooltip:[cite: 9]
  - `src/components/feedback/tooltip/index.tsx` (`aria-describedby` + portal)[cite: 9]

## Testing Pattern

- React component renderer tests do not exist in the repo[cite: 9].
- Logic helper tests:[cite: 9]
  - `helpers.test.ts` (node:test)[cite: 9]

Example:[cite: 9]

- `src/components/navigation/pagination/helpers.test.ts`[cite: 9]

## Docs / Demo Pattern

- Docs live demos:[cite: 9]
  - `docs/components/demos/**`[cite: 9]
- MDX side demo map:[cite: 9]
  - `docs/components/mdx.tsx`[cite: 9]

Rule:[cite: 9]

- When generating docs, AI must read component samples from the "demos" folder (do not duplicate code)[cite: 9].
