# TYPES_AND_ENUMS

This document turns type/enum usage in the repo into "generation rules for AI"[cite: 13].

## Global Tokens & Unions

Main source of types:[cite: 13]

- `src/libs/infrastructure/types/index.ts`[cite: 13]

Example types:[cite: 13]

- `Variants`, `Status`, `Color`, `Sizes`, `BorderRadiuses`[cite: 13]
- `Option` (used for Select)[cite: 13]
- Upload:[cite: 13]
  - `UploadProgress`, `UploadFileStatus`[cite: 13]
- Table:[cite: 13]
  - `TableColumnProps<T>`, `FilterDataType`, `HTMLTableElementWithCustomAttributes`[cite: 13]

## Shared Props Mixins

Common prop interfaces:[cite: 13]

- `src/libs/infrastructure/types/IGlobalProps.ts`[cite: 13]

Most frequently used mixins:[cite: 13]

- `IVariantProps`[cite: 13]
- `IStatusProps`[cite: 13]
- `IColorProps`[cite: 13]
- `IBorderProps`[cite: 13]
- `IIconProps`[cite: 13]
- `ISizeProps`[cite: 13]
- `IUpperCaseProps`[cite: 13]

Rule:[cite: 13]

- When adding a new component, reuse these mixins wherever possible[cite: 13].

## Enums

Shared enum pattern:[cite: 13]

- `src/libs/infrastructure/shared/Enums.ts`[cite: 13]
  - `FilterOperator` (Table filter operators)[cite: 13]
  - `SessionStorage`[cite: 13]
  - `DispatchEvent`[cite: 13]

Rule:[cite: 13]

- Do not invent a "random union" instead of an enum in areas like table/filter/component state[cite: 13].
- First check if an appropriate enum exists inside Enums.ts[cite: 13].

## Discriminated Unions Examples

Select:[cite: 13]

- Inside `src/components/form/select/Props.ts`:[cite: 13]
  - `IMultiple` vs `ISingle`[cite: 13]

Table FilterValue:[cite: 13]

- `FilterValue` inside `src/components/data-display/table/index.tsx`:[cite: 13]
  - Exports of `src/components/data-display/table/IProps.ts`[cite: 13]

## Constants

- Constant lists are kept in domain files like "helpers.ts"[cite: 13].

Example:[cite: 13]

- `src/components/navigation/pagination/helpers.ts`:[cite: 13]
  - `PER_PAGE_OPTIONS`[cite: 13]

- Position constants:[cite: 13]
  - Tooltip:[cite: 13]
    - `src/components/feedback/tooltip/position.ts`[cite: 13]
