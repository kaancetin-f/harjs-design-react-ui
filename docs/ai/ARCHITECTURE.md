# ARCHITECTURE

This document summarizes the repo's existing architecture/layer relationships for AI as "actionable rules"[cite: 8].

## Layers and Responsibilities

1. `src/components/` (UI)[cite: 8]
   - Contains DOM/overlay behavior (portal + focus management)[cite: 8].
   - Imports its own CSS file inside the component[cite: 8].
   - Provides a public component default export (`index.tsx`)[cite: 8].

2. `src/libs/infrastructure/` (shared)[cite: 8]
   - Layer providing tokens/types/utilities[cite: 8].
   - `Utils.ts` with functions for className generation, deep equal, null-checks, etc[cite: 8].
   - `types/index.ts` with design tokens (Variants/Colors/Sizes…) and component-friendly model types[cite: 8].
   - `shared/Enums.ts` with common enums (e.g., `FilterOperator`)[cite: 8].

3. `src/libs/core/application/` (context & hooks)[cite: 8]
   - `ConfigProvider`, `LoadingProvider`, `NotificationProvider`[cite: 8]
   - `useConfirm`, `useValidation`, `useNotification`[cite: 8]

## Dependency Direction (Real Code Behavior)

- UI components use types/utilities from `libs/infrastructure` (e.g., `src/components/form/select/index.tsx` -> `Utils` and `Option`)[cite: 8].
- In `core/application`, some hooks import relevant component helpers to build payloads[cite: 8].
  - Although this might look like a deviation from the ideal "layer arrow direction", this is how the repo actually operates[cite: 8].
  - Rule: Do not change these dependencies under the pretext of "best practice"[cite: 8].

## State Management

### Controlled

- Modal: `open: { get; set }`[cite: 8]
  - `src/components/feedback/modal/IProps.ts`[cite: 8]
  - `src/components/feedback/modal/index.tsx`[cite: 8]
- Steps: Controlled if `currentStep` exists; otherwise internal state + sessionStorage[cite: 8]
  - `src/components/navigation/steps/index.tsx`[cite: 8]

### Internal/UI Animation State

- Modal/Popover/Tooltip overlay states (mounted/entered/exited/open etc.) are managed internally[cite: 8].

## Context/Provider

- `NotificationProvider`:[cite: 8]
  - Provides `dispatchToast` and `askConfirm`[cite: 8]
  - Renders `Notification` and `PopupConfirm` inside the provider[cite: 8]
  - `src/libs/core/application/contexts/Notification.tsx`[cite: 8]

- `LoadingProvider`:[cite: 8]
  - If `isLoading` is true, renders `components/feedback/loading` via portal[cite: 8]
  - `src/libs/core/application/contexts/Loading.tsx`[cite: 8]

## Styling & Theme

- Global token CSS:[cite: 8]
  - `src/assets/css/core/har-core.css` (import path: `src/index.ts`)[cite: 8]
- Component-level CSS:[cite: 8]
  - e.g., `src/components/feedback/modal/index.tsx` -> `assets/css/components/feedback/modal/styles.css`[cite: 8]
- Theme inline style:[cite: 8]
  - CSS vars for Steps theme:[cite: 8]
    - `src/components/navigation/steps/helpers.ts` (`getStepsThemeStyle`)[cite: 8]

## Public API

- Public API: `src/index.ts`[cite: 8]
- Sub-entry points: `package.json exports` mapping[cite: 8]
  - `./config`, `./hooks`, `./types`, `./utils`, `./styles.css`[cite: 8]
