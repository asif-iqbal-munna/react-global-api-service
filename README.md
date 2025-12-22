# React Global API Service (Axios + TanStack Query)

A scalable, beginner-friendly API and data-fetching architecture for Next.js App Router (React 18/19) using Axios and TanStack Query.

This setup is designed to support large applications (100+ modules) using ONE generic query hook and ONE generic mutation hook, without repetitive code.

---

## Why This Architecture Exists

### Problems in typical projects

* One hook per module (useUsersQuery, useOrdersQuery, etc.)
* Repeated fetch and mutation logic
* Unstable React Query cache keys
* Filters causing unnecessary refetches
* Scattered authentication logic
* Difficult to scale and maintain

### What this solves

* One query hook for all GET requests
* One mutation hook for all POST/PUT/PATCH/DELETE requests
* Centralized Axios configuration
* Stable, deterministic cache keys
* Safe and normalized filters
* Works with SSR, RSC, and React 18/19 concurrency
* Easy authentication and error handling using interceptors

---

## Project Structure

```
app/
 ├─ layout.tsx
 ├─ Providers.tsx

hooks/
 ├─ useAppQuery.ts
 ├─ useAppMutation.ts

service/
 ├─ api/
 │   ├─ apiClient.ts
 │   ├─ apiInstance.ts
 │   └─ interceptors/
 │       ├─ request.ts
 │       └─ response.ts
 └─ query/
     ├─ normalizeFilters.ts
     ├─ queryFetcher.ts
     └─ queryKeyFactory.ts
```

---

## Setup

### Install Dependencies

```bash
npm install @tanstack/react-query axios
```

### React Query Provider

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

Wrap in `app/layout.tsx`.

---

## Axios Layer

### apiInstance.ts

```ts
import axios from "axios";

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});
```

### Interceptors

#### Request Interceptor

```ts
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Response Interceptor

```ts
apiInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);
```

### apiClient.ts

```ts
import { axiosInstance } from "./axiosInstance";

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

```

---

## Query Utilities

### normalizeFilters.ts

```ts
export function normalizeFilters(obj: any): any {
  if (Array.isArray(obj)) return [...obj].sort();
  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        if (obj[key] !== undefined && obj[key] !== null) {
          acc[key] = normalizeFilters(obj[key]);
        }
        return acc;
      }, {} as any);
  }
  return obj;
}
```

### queryKeyFactory.ts

```ts
import { normalizeFilters } from "./normalizeFilters";

export const queryKeyFactory = {
  list: (key: string, filters?: any) => [
    key,
    normalizeFilters(filters),
  ],
};
```

### queryFetcher.ts

```ts
import { apiClient } from "../api/apiClient";

export function queryFetcher<T>({
  url,
  filters,
  signal,
}: {
  url: string;
  filters?: any;
  signal?: AbortSignal;
}): Promise<T> {
  return apiClient<T>({ url, params: filters, signal } as any);
}
```

---

## Hooks

### useAppQuery.ts

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { queryFetcher } from "@/service/query/queryFetcher";
import { queryKeyFactory } from "@/service/query/queryKeyFactory";

export function useAppQuery<T>({
  key,
  url,
  filters,
  enabled = true,
}: {
  key: string;
  url: string;
  filters?: any;
  enabled?: boolean;
}) {
  return useQuery<T>({
    queryKey: queryKeyFactory.list(key, filters),
    queryFn: ({ signal }) => queryFetcher<T>({ url, filters, signal }),
    enabled,
  });
}
```

### useAppMutation.ts

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/service/api/apiClient";

export function useAppMutation({
  url,
  method,
  invalidateKeys = [],
}: {
  url: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  invalidateKeys?: string[];
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient(url, { method, data }),
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
    },
  });
}
```

---

## Usage Examples

### Fetch Data

```ts
"use client";

import { useAppQuery } from "@/hooks/useAppQuery";

export function UsersClient() {
  const { data, isLoading } = useAppQuery({
    key: "users",
    url: "/api/users",
    filters: { role: "admin", tags: ["active"] },
  });

  if (isLoading) return <p>Loading...</p>;

  return data?.map((u: any) => <p key={u.id}>{u.name}</p>);
}
```

### Mutate Data

```ts
"use client";

import { useAppMutation } from "@/hooks/useAppMutation";

export function CreateUser() {
  const mutation = useAppMutation({
    url: "/api/users",
    method: "POST",
    invalidateKeys: ["users"],
  });

  return (
    <button onClick={() => mutation.mutate({ name: "John" })}>
      Create User
    </button>
  );
}
```

---

## Notes

* Axios handles HTTP and auth headers.
* TanStack Query handles caching, deduplication, and state.
* normalizeFilters ensures cache keys are stable.
* queryKeyFactory creates deterministic keys for React Query.
* queryFetcher centralizes fetch logic and supports abort signals.
* Hooks are generic and reusable for any module.
* Supports SSR, RSC, and React 18/19 concurrent rendering.

---

## Benefits

* Scales to 100+ modules with minimal boilerplate
* Easy to test and maintain
* Centralized error handling
* Supports tokens and interceptors
* Clean, beginner-friendly API layer

```
```
