"use client";

import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { useEntrance } from "@/shared/motion/use-entrance";
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
  const { load, isLoading } = useLoadSampleData();
  const cardRef = useRef<HTMLElement>(null);
  useEntrance(cardRef, true);

  const handleStartFromScratch = () => {
    dismissOnboarding();
    onStartFromScratch();
  };

  return (
    <section
      ref={cardRef}
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
        <Button variant="berry" disabled={isLoading} onClick={() => void load()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>Load sample data</span>
        </Button>
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
