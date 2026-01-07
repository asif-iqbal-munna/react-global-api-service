/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiClient } from "../api/client/apiClient";

export async function queryFetcher<T>({
  url,
  filters,
  signal,
}: {
  url: string;
  filters?: Record<string, any>;
  signal?: AbortSignal;
}) {
  return apiClient<T>(url, {
    params: filters,
    signal,
  });
}
