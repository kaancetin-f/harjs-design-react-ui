export function areSameFiles(left: File[], right: File[]) {
  if (left === right) return true;
  if (left.length !== right.length) return false;

  return left.every((file, index) => {
    const other = right[index];

    return (
      file === other ||
      (file.name === other.name && file.size === other.size && file.lastModified === other.lastModified)
    );
  });
}

export function formatFileSize(bytes: number): { value: string; unit: string } {
  if (bytes < 1024) return { value: String(bytes), unit: "B" };
  if (bytes < 1024 * 1024) return { value: (bytes / 1024).toFixed(bytes < 10 * 1024 ? 2 : 1), unit: "KB" };

  return { value: (bytes / (1024 * 1024)).toFixed(1), unit: "MB" };
}

export function openFilePreview(file: File) {
  const url = URL.createObjectURL(file);

  window.open(url, "_blank");
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
