/* eslint-disable @typescript-eslint/no-explicit-any */

import { axiosInstance } from "../axiosInstance";

export async function apiClient<T>(
  url: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    data?: any;
    params?: Record<string, any>;
    signal?: AbortSignal;
  }
): Promise<T> {
  const response = await axiosInstance.request<T>({
    url,
    method: options?.method ?? "GET",
    data: options?.data,
    params: options?.params,
    signal: options?.signal, // AbortController support
  });

  return response.data;
}
