"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../service/api/client/apiClient";

export function useAppMutation<TData, TVariables>({
  url,
  method = "POST",
  invalidateKeys = [],
}: {
  url: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  invalidateKeys?: string[];
}) {
  const qc = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: (data) =>
      apiClient<TData>(url, {
        method,
        data,
      }),
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        qc.invalidateQueries({ queryKey: [key] })
      );
    },
  });
}
