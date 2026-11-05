import { apiData, getHttpClient } from "@/shared/api/http-client";
import type { Subtask } from "../model/subtask";

export async function fetchSubtasks(activityId: string): Promise<Subtask[]> {
  const data = apiData(await getHttpClient().GET("/v1/activities/{activityId}/subtasks", {
    params: { path: { activityId } },
  }));
  return data.items;
}

export async function createSubtask(input: {
  activityId: string;
  title: string;
}): Promise<Subtask> {
  return apiData(await getHttpClient().POST("/v1/activities/{activityId}/subtasks", {
    params: { path: { activityId: input.activityId } },
    body: { title: input.title.trim() },
  }));
}

export async function toggleSubtask(input: {
  id: string;
  activityId: string;
  isDone: boolean;
}): Promise<Subtask> {
  return apiData(await getHttpClient().PATCH("/v1/subtasks/{id}", {
    params: { path: { id: input.id } },
    body: { isDone: input.isDone },
  }));
}

export async function deleteSubtask(input: {
  id: string;
  activityId: string;
}): Promise<void> {
  await getHttpClient().DELETE("/v1/subtasks/{id}", {
    params: { path: { id: input.id } },
  });
}
