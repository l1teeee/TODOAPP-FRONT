// Placeholder; the API integration brief replaces it with POST /v1/ai/daily-brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { DailyBriefInput } from "../model/daily-brief";

export async function writeDailyBrief(input: DailyBriefInput): Promise<string> {
  void input;
  await simulateLatency();
  throw new Error("The AI daily brief endpoint is not connected yet.");
}
