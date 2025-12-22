export function normalizeFilters(filters?: Record<string, unknown>) {
  if (!filters) return undefined;

  const sorted: Record<string, unknown> = {};

  Object.keys(filters)
    .sort()
    .forEach((key) => {
      const value = filters[key];

      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        sorted[key] = [...value].sort();
      } else if (typeof value === "object") {
        sorted[key] = normalizeFilters(value as Record<string, unknown>);
      } else {
        sorted[key] = value;
      }
    });

  return sorted;
}
