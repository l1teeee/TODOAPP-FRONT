"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ActivityInput,
  ActivityPatch,
  ActivityQuery,
} from "../model/activity";
import {
  createActivity,
  deleteActivityForever,
  fetchActivities,
  fetchActivity,
  listCompleted,
  listTrashed,
  restoreActivity,
  trashActivity,
  updateActivity,
} from "./activities-api";

export const activityKeys = {
  all: ["activities"] as const,
  list: (q: ActivityQuery) => ["activities", "list", q] as const,
  detail: (id: string | null) => ["activities", "detail", id] as const,
  completed: () => ["activities", "completed"] as const,
  trashed: () => ["activities", "trashed"] as const,
};

export function useActivities(query: ActivityQuery) {
  return useQuery({
    queryKey: activityKeys.list(query),
    queryFn: () => fetchActivities(query),
  });
}

export function useActivity(id: string | null) {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return fetchActivity(id);
    },
    enabled: id !== null,
  });
}

export function useCompletedActivities() {
  return useQuery({
    queryKey: activityKeys.completed(),
    queryFn: () => listCompleted(),
  });
}

export function useTrashedActivities() {
  return useQuery({
    queryKey: activityKeys.trashed(),
    queryFn: () => listTrashed(),
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ActivityInput) => createActivity(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; patch: ActivityPatch }) =>
      updateActivity(variables.id, variables.patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useTrashActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trashActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useRestoreActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useDeleteActivityForever() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteActivityForever(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
