"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../service/api/client/apiClient";

type MutationFn<TData, TVariables> = (variables?: TVariables) => Promise<TData>;

interface UseAppMutationOptions<TData, TVariables> {
  url?: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  invalidateKeys?: string[];
  mutationFn?: MutationFn<TData, TVariables>;
}

export function useAppMutation<TData = unknown, TVariables = void>({
  url,
  method = "POST",
  invalidateKeys = [],
  mutationFn,
}: UseAppMutationOptions<TData, TVariables>) {
  const qc = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables?: TVariables) => {
      if (mutationFn) {
        return mutationFn(variables);
      }

      if (!url) {
        throw new Error("Either mutationFn or url must be provided");
      }

      return apiClient<TData>(url, {
        method,
        ...(variables !== undefined && { data: variables }),
      });
    },

    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        qc.invalidateQueries({ queryKey: [key] })
      );
    },
  });
}
