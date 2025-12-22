"use client";

import { useQuery } from "@tanstack/react-query";
import { queryFetcher } from "../service/query/queryFetcher";
import { queryKeyFactory } from "../service/query/queryKeyFactory";

export function useAppQuery<T>({
  key,
  url,
  filters,
  enabled = true,
  staleTime = 60_000,
}: {
  key: string;
  url: string;
  filters?: Record<string, unknown>;
  enabled?: boolean;
  staleTime?: number;
}) {
  return useQuery<T>({
    queryKey: queryKeyFactory.list(key, filters),
    queryFn: ({ signal }) => queryFetcher<T>({ url, filters, signal }),
    enabled,
    staleTime,
  });
}
