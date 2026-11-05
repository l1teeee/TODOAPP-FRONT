"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createList,
  deleteList,
  fetchLists,
  updateList,
  type ListInput,
} from "./lists-api";

export const listKeys = {
  all: ["lists"] as const,
};

export function useLists() {
  return useQuery({
    queryKey: listKeys.all,
    queryFn: fetchLists,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ListInput) => createList(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; patch: Partial<ListInput> }) =>
      updateList(variables.id, variables.patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.all });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}
