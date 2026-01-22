/* eslint-disable @typescript-eslint/no-explicit-any */
export type ServerFetchOptions = {
  url: string;
  cache?: "force-cache" | "no-store" | "default";
  revalidate?: number;
  tags?: string[];
  params?: Record<string, any>;
  method?: string,
  body?: any,
};
