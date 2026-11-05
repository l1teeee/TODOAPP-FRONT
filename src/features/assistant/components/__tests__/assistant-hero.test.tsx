import { render, screen } from "@testing-library/react";
import { AssistantHero } from "../assistant-hero";
import type { DailyBriefInput } from "../../model/daily-brief";

jest.mock("../../api/use-daily-brief", () => ({ useDailyBrief: () => ({ brief: { message: "You're all caught up for today.", source: mockSource } }) }));
jest.mock("@/shared/ui/mesh-gradient-surface", () => ({ MeshGradientSurface: () => null }));
jest.mock("@/shared/motion/gsap", () => ({ gsap: { matchMedia: () => ({ add: (_query: string, callback: () => void) => callback(), revert: () => undefined }) }, useGSAP: (callback: () => void) => callback(), NO_REDUCED_MOTION: "motion", markWillChange: () => undefined }));

let mockSource = "local";
const input: DailyBriefInput = { firstName: "E2E", localTime: "09:00", locale: "en", items: [] };

test("shows the local greeting and message", () => {
  mockSource = "local";
  render(<AssistantHero input={input} onSelect={jest.fn()} />);
  expect(screen.getByRole("heading", { name: "Hi, E2E" })).toBeInTheDocument();
  expect(screen.getByText("You're all caught up for today.")).toBeInTheDocument();
  expect(screen.getByText("Smart summary")).toBeInTheDocument();
});

test("labels an AI brief", () => {
  mockSource = "ai";
  render(<AssistantHero input={input} onSelect={jest.fn()} />);
  expect(screen.getByText("AI assistant")).toBeInTheDocument();
});
