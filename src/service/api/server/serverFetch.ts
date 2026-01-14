/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
export type ServerFetchOptions = {
  url: string;
  cache?: "force-cache" | "no-store" | "default";
  revalidate?: number;
  tags?: string[];
  params?: Record<string, any>;
};

export async function serverFetch<T = unknown>({
  url,
  cache,
  revalidate,
  tags,
  params,
  method = "GET",
  body,
}: ServerFetchOptions & { method?: string; body?: any }): Promise<T | null> {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}${query}`;

  const fetchOptions: RequestInit & { next?: any } = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) fetchOptions.body = JSON.stringify(body);
  if (cache) fetchOptions.cache = cache;

  if (revalidate !== undefined || (tags && tags.length > 0)) {
    fetchOptions.next = {};
    if (revalidate !== undefined) fetchOptions.next.revalidate = revalidate;
    if (tags && tags.length > 0) fetchOptions.next.tags = tags;
  }

  const startTime = performance.now();

  try {
    const res = await fetch(endpoint, fetchOptions);

    const duration = (performance.now() - startTime).toFixed(2);

    console.info(
      `[serverFetch] ${dayjs(new Date()).format(
        "hh:mm:ss a"
      )} ${method} ${url} | ${res.status} | ${duration}ms`
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(
        `[serverFetch ERROR] ${res.status} ${res.statusText}: ${text}`
      );
      throw new Error(`Server fetch failed: ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    const duration = (performance.now() - startTime).toFixed(2);

    console.error(
      `[serverFetch FAILED] ${method} ${url} | ${duration}ms | Error: ${
        error instanceof Error ? error.message : "Unknown"
      }`
    );

    return null;
  }
}
