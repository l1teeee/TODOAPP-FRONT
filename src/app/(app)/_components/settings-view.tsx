"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useSignOut } from "@/features/auth/api/use-auth";
import { useProfile } from "@/features/profile/api/use-profile";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { useEntrance } from "@/shared/motion/use-entrance";
import { useEnabledModules } from "@/shared/api/use-enabled-modules";
import { useTheme, type ThemePreference } from "@/shared/theme/use-theme";
import { Button } from "@/shared/ui/button";
import { SegmentedControl } from "@/shared/ui/segmented-control";
import { Skeleton } from "@/shared/ui/skeleton";
import { useLoadSampleData } from "./sample-data";

const THEME_OPTIONS: readonly { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function SettingsView() {
  const { data: modules } = useEnabledModules();
  const canLoadSamples = ["lists", "tags", "subtasks"].every((module) =>
    modules?.includes(module),
  );
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const { preference, setPreference } = useTheme();
  const signOutMutation = useSignOut();
  const sampleData = useLoadSampleData();
  const pageRef = useRef<HTMLDivElement>(null);
  useEntrance(pageRef, true);

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <div ref={pageRef} className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-fg">Settings</h1>
        <p className="mt-1 text-xs text-fg-secondary">
          Manage your profile, theme preferences and account.
        </p>
      </header>

      <section className="rounded-card border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-fg">Profile</h2>
        <div className="mt-4">
          {isLoading || !profile ? (
            <div className="space-y-4" aria-busy="true">
              <Skeleton className="h-10 w-full rounded-control" />
              <Skeleton className="h-10 w-full rounded-control" />
              <Skeleton className="h-8 w-32 rounded-control" />
            </div>
          ) : (
            <ProfileForm key={profile.id} profile={profile} />
          )}
        </div>
      </section>

      <section className="rounded-card border border-line bg-surface p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold text-fg">Appearance</h2>
            <p className="mt-1 text-xs text-fg-secondary">
              Choose how TODO App looks on your device.
            </p>
          </div>
          <SegmentedControl
            label="Appearance"
            options={THEME_OPTIONS}
            value={preference}
            onChange={setPreference}
            className="w-full sm:w-64"
          />
        </div>
      </section>

      <section className="rounded-card border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-fg">Account</h2>
        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold text-fg-secondary">Email</p>
            <p className="mt-1 text-sm text-fg">
              {profile?.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canLoadSamples ? (
              <Button
                variant="secondary"
                disabled={sampleData.isLoading}
                onClick={() => void sampleData.load()}
              >
                {sampleData.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                <span>Load sample data</span>
              </Button>
            ) : null}
            <Button
              variant="secondary"
              disabled={signOutMutation.isPending}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
