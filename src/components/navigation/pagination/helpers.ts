type Option = { value: string | number | null; text: string };
export const PER_PAGE_OPTIONS: Option[] = [
  { value: 5, text: "5" },
  { value: 10, text: "10" },
  { value: 15, text: "15" },
  { value: 50, text: "50" },
  { value: 75, text: "75" },
  { value: 100, text: "100" },
];

export type PaginationToken = number | "ellipsis";

export const optionFor = (
  value: number,
  allLabel: string,
  totalRecords: number,
): Option => {
  const preset = PER_PAGE_OPTIONS.find((entry) => entry.value === value);
  if (preset) return preset;
  if (value === totalRecords) return { value, text: allLabel };
  return { value, text: String(value) };
};

export const clampPage = (page: number, totalPageCount: number) => {
  if (totalPageCount <= 0) return 1;
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(1, Math.trunc(page)), totalPageCount);
};

export const getRecordRange = (
  currentPage: number,
  perPage: number,
  totalRecords: number,
) => {
  if (totalRecords <= 0 || perPage <= 0) return { start: 0, end: 0 };

  const totalPageCount = Math.ceil(totalRecords / perPage);
  const page = clampPage(currentPage, totalPageCount);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalRecords);
  return { start, end };
};

export const parsePageJump = (raw: string, totalPageCount: number) => {
  const trimmed = raw.trim();
  if (!trimmed || !/^\d+$/.test(trimmed)) return null;
  const page = Number(trimmed);
  if (page < 1 || page > totalPageCount) return null;
  return page;
};

export const getPaginationRange = (
  currentPage: number,
  totalPageCount: number,
  siblingCount = 2,
): PaginationToken[] => {
  if (totalPageCount <= 0) return [];

  const current = clampPage(currentPage, totalPageCount);
  const totalNumbers = siblingCount * 2 + 5;

  if (totalPageCount <= totalNumbers) {
    return Array.from({ length: totalPageCount }, (_, index) => index + 1);
  }

  const left = Math.max(current - siblingCount, 1);
  const right = Math.min(current + siblingCount, totalPageCount);
  const showLeft = left > 2;
  const showRight = right < totalPageCount - 1;

  if (!showLeft && showRight) {
    const count = 3 + 2 * siblingCount;
    return [
      ...Array.from({ length: count }, (_, index) => index + 1),
      "ellipsis",
      totalPageCount,
    ];
  }

  if (showLeft && !showRight) {
    const count = 3 + 2 * siblingCount;
    return [
      1,
      "ellipsis",
      ...Array.from(
        { length: count },
        (_, index) => totalPageCount - count + 1 + index,
      ),
    ];
  }

  return [
    1,
    "ellipsis",
    ...Array.from({ length: right - left + 1 }, (_, index) => left + index),
    "ellipsis",
    totalPageCount,
  ];
};
