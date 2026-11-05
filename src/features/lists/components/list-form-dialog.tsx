"use client";

import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useCreateList, useUpdateList } from "../api/use-lists";
import { ListConflictError } from "../api/lists-api";
import type { List } from "../model/list";
import { ListIcon } from "./list-icon";

const LIST_ICON_KEYS = [
  "folder",
  "briefcase",
  "pen-tool",
  "zap",
  "globe",
  "book-open",
] as const;

const NAME_MAX_LENGTH = 40;

export interface ListFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog renames or re-icons this list instead of creating one. */
  list?: List | null;
}

function validateName(name: string): string | undefined {
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > NAME_MAX_LENGTH) {
    return `Name must be between 1 and ${NAME_MAX_LENGTH} characters.`;
  }
  return undefined;
}

interface ListFormProps {
  list: List | null;
  onDone: () => void;
}

function ListForm({ list, onDone }: ListFormProps) {
  const createMutation = useCreateList();
  const updateMutation = useUpdateList();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [name, setName] = useState(list?.name ?? "");
  const [icon, setIcon] = useState(list?.icon ?? LIST_ICON_KEYS[0]);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleError = (cause: unknown) => {
    if (cause instanceof ListConflictError) {
      setError(cause.message);
      return;
    }
    setError("Something went wrong. Please try again.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateName(name);
    setError(validationError);
    if (validationError) return;

    if (list) {
      updateMutation.mutate(
        { id: list.id, patch: { name, icon } },
        { onSuccess: onDone, onError: handleError },
      );
      return;
    }
    createMutation.mutate({ name, icon }, { onSuccess: onDone, onError: handleError });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="Name" error={error}>
        <Input
          autoFocus
          value={name}
          maxLength={NAME_MAX_LENGTH}
          disabled={isPending}
          onChange={(event) => {
            setName(event.target.value);
            setError(undefined);
          }}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-fg-secondary">Icon</span>
        <div role="radiogroup" aria-label="Icon" className="flex flex-wrap gap-2">
          {LIST_ICON_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={icon === key}
              aria-label={key}
              onClick={() => setIcon(key)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-control border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer",
                icon === key
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-fg-secondary hover:bg-surface-muted",
              )}
            >
              <ListIcon icon={key} className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>{list ? "Save" : "Create list"}</span>
        </Button>
      </div>
    </form>
  );
}

export function ListFormDialog({
  open,
  onOpenChange,
  list = null,
}: ListFormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={list ? "Rename list" : "New list"}
      description="Lists group your activities."
    >
      <ListForm list={list} onDone={() => onOpenChange(false)} />
    </Dialog>
  );
}
