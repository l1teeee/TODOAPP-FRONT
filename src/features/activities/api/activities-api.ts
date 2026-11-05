import { apiData, getHttpClient } from "@/shared/api/http-client";
import type { paths } from "@/shared/api/schema";
import type {
  Activity,
  ActivityInput,
  ActivityPatch,
  ActivityQuery,
} from "../model/activity";
import { viewRange } from "../model/view-range";

interface ActivityPage {
  items: Activity[];
  nextCursor: string | null;
}

export async function fetchActivities(
  query: ActivityQuery,
): Promise<Activity[]> {
  const range = viewRange(query.view, new Date());
  const params: NonNullable<paths["/v1/activities"]["get"]["parameters"]["query"]> = {
    listId: query.listId,
    tagId: query.tagId,
    q: query.q,
  };
  if (range.mode === "range") {
    params.from = range.start;
    params.to = range.end;
  } else if (range.mode === "unscheduled") {
    params.unscheduled = "true";
  }
  const data = apiData(await getHttpClient().GET("/v1/activities", {
    params: { query: params },
  }));
  return data.items;
}

export async function fetchActivity(id: string): Promise<Activity | null> {
  return apiData(await getHttpClient().GET("/v1/activities/{id}", {
    params: { path: { id } },
  }));
}

export async function listCompleted(cursor?: string): Promise<ActivityPage> {
  return apiData(await getHttpClient().GET("/v1/activities/completed", {
    params: { query: { cursor } },
  }));
}

export async function listTrashed(cursor?: string): Promise<ActivityPage> {
  return apiData(await getHttpClient().GET("/v1/activities/trash", {
    params: { query: { cursor } },
  }));
}

export async function createActivity(input: ActivityInput): Promise<Activity> {
  return apiData(await getHttpClient().POST("/v1/activities", {
    body: {
      ...input,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      location: input.location?.trim() || null,
      scheduledDate: input.kind === "habit" ? null : input.scheduledDate,
    },
  }));
}

export async function updateActivity(
  id: string,
  patch: ActivityPatch,
): Promise<Activity> {
  return apiData(await getHttpClient().PATCH("/v1/activities/{id}", {
    params: { path: { id } },
    body: {
      title: patch.title,
      description: patch.description,
      status: patch.status,
      scheduledDate: patch.scheduledDate,
      startTime: patch.startTime,
      endTime: patch.endTime,
      location: patch.location,
      icon: patch.icon,
      listId: patch.listId,
      tagIds: patch.tagIds,
    },
  }));
}

export async function trashActivity(id: string): Promise<void> {
  await getHttpClient().POST("/v1/activities/{id}/trash", {
    params: { path: { id } },
  });
}

export async function restoreActivity(id: string): Promise<Activity> {
  return apiData(await getHttpClient().POST("/v1/activities/{id}/restore", {
    params: { path: { id } },
  }));
}

export async function deleteActivityForever(id: string): Promise<void> {
  await getHttpClient().DELETE("/v1/activities/{id}", {
    params: { path: { id } },
  });
}
