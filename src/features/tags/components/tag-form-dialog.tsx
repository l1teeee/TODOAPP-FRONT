"use client";

import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { TagConflictError } from "../api/tags-api";
import { useCreateTag, useUpdateTag } from "../api/use-tags";
import type { Tag, TagColor } from "../model/tag";
import { TAG_COLOR_CLASSES } from "./tag-chip";

const TAG_COLORS: readonly TagColor[] = [
  "purple",
  "blue",
  "pink",
  "orange",
  "green",
  "gray",
];

const TAG_NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,29}$/;

export interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this tag instead of creating one. */
  tag?: Tag | null;
}

function validateName(name: string): string | undefined {
  if (!TAG_NAME_PATTERN.test(name)) {
    return "Use 1 to 30 lowercase letters, numbers or hyphens, starting with a letter or number.";
  }
  return undefined;
}

interface TagFormProps {
  tag: Tag | null;
  onDone: () => void;
}

function TagForm({ tag, onDone }: TagFormProps) {
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState<TagColor>(tag?.color ?? TAG_COLORS[0]);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleError = (cause: unknown) => {
    if (cause instanceof TagConflictError) {
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

    if (tag) {
      updateMutation.mutate(
        { id: tag.id, patch: { name, color } },
        { onSuccess: onDone, onError: handleError },
      );
      return;
    }
    createMutation.mutate({ name, color }, { onSuccess: onDone, onError: handleError });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="Name" error={error}>
        <Input
          autoFocus
          value={name}
          maxLength={30}
          disabled={isPending}
          onChange={(event) => {
            setName(event.target.value);
            setError(undefined);
          }}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-fg-secondary">Color</span>
        <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-2">
          {TAG_COLORS.map((key) => {
            const palette = TAG_COLOR_CLASSES[key];
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={color === key}
                aria-label={key}
                onClick={() => setColor(key)}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer",
                  palette.bg,
                  color === key ? "border-accent" : "border-transparent",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("h-3 w-3 rounded-full bg-current", palette.fg)}
                />
              </button>
            );
          })}
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
          <span>{tag ? "Save" : "Create tag"}</span>
        </Button>
      </div>
    </form>
  );
}

export function TagFormDialog({
  open,
  onOpenChange,
  tag = null,
}: TagFormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={tag ? "Rename tag" : "New tag"}
      description="Tags label your activities."
    >
      <TagForm tag={tag} onDone={() => onOpenChange(false)} />
    </Dialog>
  );
}
