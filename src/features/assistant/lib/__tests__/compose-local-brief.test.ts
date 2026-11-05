import { composeLocalBrief } from "../compose-local-brief";
import type { DailyBriefInput, DailyBriefItem } from "../../model/daily-brief";

const item = (title: string, startTime: string | null): DailyBriefItem => ({ id: title, title, startTime, kind: "task", endTime: null, location: null, status: "todo" });
const input: DailyBriefInput = { firstName: "E2E", localTime: "09:00", locale: "en", items: [] };

test.each([["09:00", "Good morning, E2E!"], ["12:00", "Good afternoon, E2E!"], ["18:00", "Good evening, E2E!"]])("greets at %s", (localTime, greeting) => {
  expect(composeLocalBrief({ ...input, localTime }).greeting).toBe(greeting);
});

test("orders timed upcoming items and joins the rest", () => {
  const brief = composeLocalBrief({ ...input, items: [item("Third", "12:00"), item("Untimed", null), item("First", "10:00"), item("Second", "11:00"), item("Past", "08:00")] });
  expect(brief.nextTask?.title).toBe("First");
  expect(brief.message).toBe("Your next task is First at 10:00. Then Second at 11:00 and Third at 12:00.");
});

test("reports all caught up when no timed items remain", () => {
  expect(composeLocalBrief({ ...input, items: [item("Untimed", null)] }).message).toBe("You're all caught up for today.");
});
