# PATTERNS

Patterns actually found in the repo are established as rules in this list[cite: 11].

## 1) Simple Component

When?[cite: 11]

- Components that perform simple prop-to-DOM rendering without state[cite: 11].

How?[cite: 11]

- Minimal state inside `index.tsx`[cite: 11]
- Component-level CSS import[cite: 11]
- Public export via `export default`[cite: 11]

Reference:[cite: 11]

- `src/components/feedback/loading/index.tsx`[cite: 11]

What NOT to do:[cite: 11]

- Excessive refactoring / adding internal abstractions[cite: 11].

## 2) Compound Component (Static Attachment)

When?[cite: 11]

- When multiple sub-parts in the same domain need to be grouped under a single export[cite: 11].

How?[cite: 11]

- Define base component[cite: 11]
- Attach static properties inside `index.tsx`[cite: 11]

References:[cite: 11]

- Button:[cite: 11]
  - `src/components/form/button/index.tsx`[cite: 11]
  - `src/components/form/button/Button.tsx`[cite: 11]
- Input:[cite: 11]
  - `src/components/form/input/index.tsx`[cite: 11]

What NOT to do:[cite: 11]

- Do not invent a different approach like "Compound via Context"[cite: 11].

## 3) Controlled Overlay (open / value / currentStep)

When?[cite: 11]

- When the parent wants to manage the visibility/selection state of the component[cite: 11].

How?[cite: 11]

- Set up the controlled prop with its type (value/currentStep/open.get/set)[cite: 11]
- Internal state holds UI details only, like animation/mounted[cite: 11]

References:[cite: 11]

- Modal:[cite: 11]
  - `src/components/feedback/modal/IProps.ts`[cite: 11]
  - `src/components/feedback/modal/index.tsx`[cite: 11]
- Steps:[cite: 11]
  - `src/components/navigation/steps/index.tsx`[cite: 11]
- Select:[cite: 11]
  - `src/components/form/select/Props.ts`[cite: 11]

## 4) Overlay Focus Management + createPortal

When?[cite: 11]

- When overlay DOM like Tooltip/Popover/Modal needs to be rendered above body[cite: 11].

How?[cite: 11]

- `createPortal(..., document.body)`[cite: 11]
- ESC + click-outside / blur management[cite: 11]
- Focus restore + tab trap in Modal/Popover[cite: 11]

References:[cite: 11]

- Modal:[cite: 11]
  - `src/components/feedback/modal/index.tsx`[cite: 11]
- Popover:[cite: 11]
  - `src/components/feedback/popover/index.tsx`[cite: 11]
- Tooltip:[cite: 11]
  - `src/components/feedback/tooltip/index.tsx`[cite: 11]

What NOT to do:[cite: 11]

- Do not skip Portal/ESC rules[cite: 11].

## 5) Provider/Context + Hook Wrappers

When?[cite: 11]

- App-wide cross component state (notification/loading/config)[cite: 11].

How?[cite: 11]

- `createContext` + provider UI render[cite: 11]
- Hook wrappers retrieve values from the provider[cite: 11]

References:[cite: 11]

- NotificationProvider:[cite: 11]
  - `src/libs/core/application/contexts/Notification.tsx`[cite: 11]
- Hook:[cite: 11]
  - `src/libs/core/application/hooks/useNotification.ts`[cite: 11]
  - `src/libs/core/application/hooks/useConfirm.ts`[cite: 11]

## 6) Validation Hook (useValidation)

When?[cite: 11]

- When form/step-based validation rules need to be applied[cite: 11].

How?[cite: 11]

- Use `useValidation(data, rules, step?)`[cite: 11]
- Result: `{ errors, onSubmit, setSubmit }`[cite: 11]

Reference:[cite: 11]

- `src/libs/core/application/hooks/useValidation.ts`[cite: 11]
- Usage:[cite: 11]
  - `src/components/navigation/steps/index.tsx`[cite: 11]

## 7) Storage Persistence for User Navigation

When?[cite: 11]

- Behavior like Steps: "continue on the same step when user leaves and returns"[cite: 11].

How?[cite: 11]

- sessionStorage key is generated via helper[cite: 11]

Reference:[cite: 11]

- `src/components/navigation/steps/helpers.ts`[cite: 11]
- sessionStorage usage:[cite: 11]
  - `src/components/navigation/steps/index.tsx`[cite: 11]

## 8) Imperative Handle for "Reset" Operations

When?[cite: 11]

- When certain reset behaviors in complex components like Table need to be exposed to the parent[cite: 11].

How?[cite: 11]

- `forwardRef` + `useImperativeHandle`[cite: 11]
- Table:[cite: 11]
  - `filterCleaner = handleClearFilters`[cite: 11]

Reference:[cite: 11]

- `src/components/data-display/table/index.tsx`[cite: 11]
