import { ApiError } from "@/shared/api/api-error";
import { apiData, getHttpClient } from "@/shared/api/http-client";
import type { Tag, TagColor } from "../model/tag";

export class TagConflictError extends ApiError {
  constructor() {
    super(409, {
      error: {
        code: "TAG_NAME_TAKEN",
        message: "A tag with this name already exists.",
      },
    });
    this.name = "TagConflictError";
  }
}

export interface TagInput {
  name: string;
  color: TagColor;
}

export async function fetchTags(): Promise<Tag[]> {
  const data = apiData(await getHttpClient().GET("/v1/tags"));
  return data.items;
}

export async function createTag(input: TagInput): Promise<Tag> {
  try {
    return apiData(await getHttpClient().POST("/v1/tags", { body: input }));
  } catch (error) {
    if (error instanceof ApiError && error.code === "TAG_NAME_TAKEN") {
      throw new TagConflictError();
    }
    throw error;
  }
}

export async function updateTag(
  id: string,
  patch: Partial<TagInput>,
): Promise<Tag> {
  try {
    return apiData(await getHttpClient().PATCH("/v1/tags/{id}", {
      params: { path: { id } },
      body: patch,
    }));
  } catch (error) {
    if (error instanceof ApiError && error.code === "TAG_NAME_TAKEN") {
      throw new TagConflictError();
    }
    throw error;
  }
}

export async function deleteTag(id: string): Promise<void> {
  await getHttpClient().DELETE("/v1/tags/{id}", { params: { path: { id } } });
}
