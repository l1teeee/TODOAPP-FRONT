import { apiData, getHttpClient } from "@/shared/api/http-client";
import { formatLocalDate } from "@/shared/lib/dates";
import type { Summary } from "../model/summary";

export async function fetchSummary(): Promise<Summary> {
  return apiData(await getHttpClient().GET("/v1/summary", {
    params: { query: { today: formatLocalDate(new Date()) } },
  }));
}
