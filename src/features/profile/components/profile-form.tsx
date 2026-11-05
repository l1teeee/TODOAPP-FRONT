"use client";

import { Loader2 } from "lucide-react";
import { useId, useMemo, useState, type FormEvent } from "react";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { useUpdateProfile } from "../api/use-profile";
import type { Profile } from "../model/profile";

export interface ProfileFormProps {
  profile: Profile;
}

function getSupportedTimezones(currentTimezone: string): string[] {
  const supported =
    typeof Intl !== "undefined" && "supportedValuesOf" in Intl
      ? Intl.supportedValuesOf("timeZone")
      : ["UTC"];
  const set = new Set<string>(["UTC", currentTimezone, ...supported]);
  return Array.from(set);
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateProfileMutation = useUpdateProfile();
  const switchId = useId();

  const [displayName, setDisplayName] = useState(profile.displayName ?? "");
  const [timezone, setTimezone] = useState(profile.timezone);
  const [emailNotifications, setEmailNotifications] = useState(
    profile.emailNotifications,
  );
  const [saved, setSaved] = useState(false);

  const timezones = useMemo(
    () => getSupportedTimezones(profile.timezone),
    [profile.timezone],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);
    updateProfileMutation.mutate(
      {
        displayName: displayName.trim() || null,
        timezone,
        emailNotifications,
      },
      {
        onSuccess: () => {
          setSaved(true);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {saved ? <Alert variant="success">Profile saved.</Alert> : null}

      <Field label="Display name">
        <Input
          type="text"
          value={displayName}
          disabled={updateProfileMutation.isPending}
          onChange={(event) => {
            setSaved(false);
            setDisplayName(event.target.value);
          }}
        />
      </Field>

      <Field label="Time zone">
        <Select
          value={timezone}
          disabled={updateProfileMutation.isPending}
          onChange={(event) => {
            setSaved(false);
            setTimezone(event.target.value);
          }}
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div>
          <label
            htmlFor={switchId}
            className="text-xs font-semibold text-fg-secondary"
          >
            Email notifications
          </label>
          <p className="mt-0.5 text-xs text-fg-muted">
            Reminder alerts and new subtask emails
          </p>
        </div>
        <Switch
          id={switchId}
          checked={emailNotifications}
          disabled={updateProfileMutation.isPending}
          onCheckedChange={(next) => {
            setSaved(false);
            setEmailNotifications(next);
          }}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>Save</span>
        </Button>
      </div>
    </form>
  );
}
