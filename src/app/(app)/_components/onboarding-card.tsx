"use client";

import { Loader2 } from "lucide-react";
import { useEnabledModules } from "@/shared/api/use-enabled-modules";
import { Button } from "@/shared/ui/button";
import { dismissOnboarding, useLoadSampleData } from "./sample-data";

export interface OnboardingCardProps {
  firstName: string | null;
  onStartFromScratch: () => void;
}

export function OnboardingCard({
  firstName,
  onStartFromScratch,
}: OnboardingCardProps) {
  const { data: modules } = useEnabledModules();
  const canLoadSamples = ["lists", "tags", "subtasks"].every((module) =>
    modules?.includes(module),
  );
  const { load, isLoading } = useLoadSampleData();

  const handleStartFromScratch = () => {
    dismissOnboarding();
    onStartFromScratch();
  };

  return (
    <section
      aria-labelledby="onboarding-heading"
      className="rounded-card border border-line bg-surface p-6"
    >
      <h2 id="onboarding-heading" className="text-xl font-bold text-fg">
        {firstName ? `Welcome, ${firstName}!` : "Welcome!"}
      </h2>
      <p className="mt-1 text-sm text-fg-secondary">
        Start from scratch or load sample data to explore.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {canLoadSamples ? (
          <Button variant="berry" disabled={isLoading} onClick={() => void load()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            <span>Load sample data</span>
          </Button>
        ) : null}
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={handleStartFromScratch}
        >
          <span>Start from scratch</span>
        </Button>
      </div>
    </section>
  );
}
