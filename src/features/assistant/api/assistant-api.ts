import { apiData, getHttpClient } from "@/shared/api/http-client";
import type { DailyBriefInput } from "../model/daily-brief";

export async function writeDailyBrief(input: DailyBriefInput): Promise<string> {
  const data = apiData(await getHttpClient().POST("/v1/ai/daily-brief", {
    body: {
      firstName: input.firstName,
      localTime: input.localTime,
      locale: input.locale,
      items: input.items.map((item) => ({
        kind: item.kind,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        location: item.location,
        status: item.status,
      })),
    },
  }));
  return data.message;
}
