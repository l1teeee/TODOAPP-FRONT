"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Subtask } from "../model/subtask";
import {
  createSubtask,
  deleteSubtask,
  fetchSubtasks,
  toggleSubtask,
} from "./subtasks-api";

export const subtaskKeys = {
  all: ["subtasks"] as const,
  list: (activityId: string | null) =>
    ["subtasks", "list", activityId] as const,
};

export function useSubtasks(activityId: string | null) {
  return useQuery({
    queryKey: subtaskKeys.list(activityId),
    queryFn: () => {
      if (!activityId) {
        return Promise.resolve<Subtask[]>([]);
      }
      return fetchSubtasks(activityId);
    },
    enabled: activityId !== null,
  });
}

export function useCreateSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { activityId: string; title: string }) =>
      createSubtask(variables),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: subtaskKeys.list(variables.activityId),
      });
    },
  });
}

export function useToggleSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      id: string;
      activityId: string;
      isDone: boolean;
    }) => toggleSubtask(variables),
    onMutate: async (variables) => {
      const key = subtaskKeys.list(variables.activityId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Subtask[]>(key);
      if (previous) {
        queryClient.setQueryData<Subtask[]>(
          key,
          previous.map((item) =>
            item.id === variables.id
              ? { ...item, isDone: variables.isDone }
              : item,
          ),
        );
      }
      return { previous, key };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: subtaskKeys.list(variables.activityId),
      });
    },
  });
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; activityId: string }) =>
      deleteSubtask(variables),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: subtaskKeys.list(variables.activityId),
      });
    },
  });
}
