"use client";

import { useQuery } from "@tanstack/react-query";
import { queryFetcher } from "../service/query/queryFetcher";
import { normalizeFilters } from "../service/query/normalizeFilters";

export function useAppQuery<T>({
  key,
  url,
  filters,
  enabled = true,
  staleTime = 60000,
}: {
  key: string;
  url: string;
  filters?: Record<string, unknown>;
  enabled?: boolean;
  staleTime?: number;
}) {
  return useQuery<T>({
    queryKey: [key, normalizeFilters(filters)],
    queryFn: ({ signal }) => queryFetcher<T>({ url, filters, signal }),
    enabled,
    staleTime,
  });
}
