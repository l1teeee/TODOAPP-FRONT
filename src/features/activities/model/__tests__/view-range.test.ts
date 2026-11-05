import { viewRange } from "../view-range";

test("maps views to ranges relative to today", () => {
  const today = new Date(2026, 0, 28);
  expect(viewRange("today", today)).toEqual({ mode: "range", start: "2026-01-28", end: "2026-01-28" });
  expect(viewRange("tomorrow", today)).toEqual({ mode: "range", start: "2026-01-29", end: "2026-01-29" });
  expect(viewRange("next-7-days", today)).toEqual({ mode: "range", start: "2026-01-28", end: "2026-02-03" });
  expect(viewRange("all", today)).toEqual({ mode: "all" });
  expect(viewRange("inbox", today)).toEqual({ mode: "unscheduled" });
});
