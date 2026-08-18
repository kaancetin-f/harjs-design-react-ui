# GENERATION_PROTOCOL

This file defines the "code generation protocol" that the AI will follow when a new component is requested[cite: 10].

## USER REQUEST

Example:[cite: 10]

- `Add new DatePicker component.`[cite: 10]
- `Add new Pagination component.`[cite: 10]

## Understand Requirement

AI first extracts the following:[cite: 10]

- Component name / file location (does an existing pattern exist?)[cite: 10]
- API expectations: controlled/uncontrolled, overlay, compound[cite: 10]
- Required type/enum/constant usage[cite: 10]

## Search Existing Similar Components (Mandatory)

1. Search inside `src/components/**`[cite: 10]
2. Inspect at least 2 similar components[cite: 10]

Similarity signals:[cite: 10]

- Overlay + portal/focus[cite: 10]
- Controlled props model (value/currentStep/open.get-set)[cite: 10]
- Compound attachment (static child attach)[cite: 10]
- Domain match (form/select/navigation/table)[cite: 10]

## Analyze Their Architecture

Extract the following from similar components:[cite: 10]

- index.tsx render flow[cite: 10]
- IProps/Props contract[cite: 10]
- helpers/position files[cite: 10]
- component-level CSS import pattern[cite: 10]
- export pattern[cite: 10]
- test/logic helper pattern (if present)[cite: 10]

## Find Related Types/Enums/Constants

- Reuse from `src/libs/infrastructure/types/index.ts` + `IGlobalProps.ts` first[cite: 10]
- Check `src/libs/infrastructure/shared/Enums.ts` if an enum is needed[cite: 10]
- Add new enum/constant only if it is genuinely missing[cite: 10]

## Find Styling Pattern

- Component `index.tsx` must contain its own `assets/css/components/**/styles.css` import[cite: 10].
- Root nesting rules:[cite: 10]
  - token CSS variables: `var(--space-*)`, `var(--radius-*)`, `var(--gray-*)`, `var(--stroke-*)`[cite: 10]

## Find Export Pattern

- Public API is primarily `src/index.ts`[cite: 10]
- `index.tsx` default export in the component folder[cite: 10]
- Static attach if it is compound[cite: 10]

## Implement New Component

- Follow existing naming + folder patterns in the repo[cite: 10].
- Create new abstractions only if truly necessary[cite: 10].
- Do not produce breaking changes[cite: 10].

## Add/Update Tests

- No renderer test infrastructure[cite: 10].
- If logic helpers exist:[cite: 10]
  - `helpers.ts` + `helpers.test.ts` (node:test) approach[cite: 10]

## Run Verification

Mandatory:[cite: 10]

- `npm run build` (tsc + dist/asset copy + prepare-package)[cite: 10]

Optional/If present:[cite: 10]

- `npm run test:compat` (package smoke test)[cite: 10]

## Self-Validation Checklist

AI validates the following for each new component:[cite: 10]

- [ ] Existing similar components inspected[cite: 10]
- [ ] Correct architecture pattern selected[cite: 10]
- [ ] Correct naming convention used[cite: 10]
- [ ] Correct types created[cite: 10]
- [ ] Correct enum/union pattern used[cite: 10]
- [ ] Correct styling pattern used[cite: 10]
- [ ] Correct exports updated[cite: 10]
- [ ] Tests created/updated[cite: 10]
- [ ] No unnecessary dependencies[cite: 10]
- [ ] No unnecessary refactor[cite: 10]
- [ ] Typecheck passes[cite: 10]
- [ ] Lint passes (no eslint script in repo; build/tsc is essential)[cite: 10]
- [ ] Tests pass (if applicable helper tests + test:compat)[cite: 10]
- [ ] Build passes if applicable[cite: 10]
- [ ] Public API remains consistent[cite: 10]
