import { ApiError } from "@/shared/api/api-error";
import { apiData, getHttpClient } from "@/shared/api/http-client";
import type { List } from "../model/list";

export class ListConflictError extends ApiError {
  constructor() {
    super(409, {
      error: {
        code: "LIST_NAME_TAKEN",
        message: "A list with this name already exists.",
      },
    });
    this.name = "ListConflictError";
  }
}

export interface ListInput {
  name: string;
  icon: string;
}

export async function fetchLists(): Promise<List[]> {
  const data = apiData(await getHttpClient().GET("/v1/lists"));
  return data.items;
}

export async function createList(input: ListInput): Promise<List> {
  try {
    return apiData(await getHttpClient().POST("/v1/lists", { body: input }));
  } catch (error) {
    if (error instanceof ApiError && error.code === "LIST_NAME_TAKEN") {
      throw new ListConflictError();
    }
    throw error;
  }
}

export async function updateList(
  id: string,
  patch: Partial<ListInput>,
): Promise<List> {
  try {
    return apiData(await getHttpClient().PATCH("/v1/lists/{id}", {
      params: { path: { id } },
      body: patch,
    }));
  } catch (error) {
    if (error instanceof ApiError && error.code === "LIST_NAME_TAKEN") {
      throw new ListConflictError();
    }
    throw error;
  }
}

export async function deleteList(id: string): Promise<void> {
  await getHttpClient().DELETE("/v1/lists/{id}", { params: { path: { id } } });
}
