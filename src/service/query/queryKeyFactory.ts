import { normalizeFilters } from "./normalizeFilters";

export const queryKeyFactory = {
  list: (key: string, filters?: Record<string, unknown>) =>
    [key, normalizeFilters(filters)] as const,

  detail: (key: string, id: string | number) => [key, id] as const,

  infinite: (key: string, filters?: Record<string, unknown>) =>
    [key, "infinite", normalizeFilters(filters)] as const,
};
