// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { Summary } from "../model/summary";

const DEMO_SUMMARY: Summary = {
  byStatus: {
    todo: 0,
    inProgress: 0,
    completed: 0,
  },
  byKind: {
    habit: 0,
    reminder: 0,
    task: 0,
  },
  completedLast7Days: 0,
  overdueReminders: 0,
};

export async function fetchSummary(): Promise<Summary> {
  await simulateLatency();
  return {
    byStatus: { ...DEMO_SUMMARY.byStatus },
    byKind: { ...DEMO_SUMMARY.byKind },
    completedLast7Days: DEMO_SUMMARY.completedLast7Days,
    overdueReminders: DEMO_SUMMARY.overdueReminders,
  };
}
