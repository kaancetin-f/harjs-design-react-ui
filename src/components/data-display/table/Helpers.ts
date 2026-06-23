function ExtractKey<T>(key: unknown): keyof T | null {
  if (!key) return null;
  if (typeof key !== "object") return key as keyof T;
  if ("field" in key) return (key as { field: keyof T }).field;

  return null;
}

export { ExtractKey };
