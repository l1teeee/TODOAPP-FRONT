"use client";

import {
  MoreHorizontal,
  Pencil,
  Plus,
  Tag as TagIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconButton } from "@/shared/ui/icon-button";
import { Skeleton } from "@/shared/ui/skeleton";
import { useDeleteTag, useTags } from "../api/use-tags";
import type { Tag } from "../model/tag";
import { TAG_COLOR_CLASSES } from "./tag-chip";
import { TagFormDialog } from "./tag-form-dialog";

export interface TagNavProps {
  activeTagId?: string | null;
  onNavigate?: () => void;
}

export function TagNav({ activeTagId, onNavigate }: TagNavProps) {
  const router = useRouter();
  const { data: tags, isLoading } = useTags();
  const deleteMutation = useDeleteTag();

  const [createOpen, setCreateOpen] = useState(false);
  const [renaming, setRenaming] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<Tag | null>(null);

  const handleConfirmDelete = () => {
    if (!deleting) return;
    const target = deleting;
    deleteMutation.mutate(target.id, {
      onSuccess: () => {
        setDeleting(null);
        if (activeTagId === target.id) {
          router.push("/all");
        }
      },
    });
  };

  return (
    <div className="space-y-1.5" aria-busy={isLoading}>
      <div className="flex items-center justify-between pl-3 pr-3">
        <p className="text-xs font-semibold text-fg">Tags</p>
        <IconButton
          label="New tag"
          size="sm"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </div>
      {isLoading ? (
        <div className="space-y-1 px-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      ) : !tags || tags.length === 0 ? (
        <div className="px-3">
          <EmptyState
            icon={<TagIcon className="h-4 w-4" aria-hidden="true" />}
            title="No tags yet"
            action={
              <IconButton label="New tag" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            }
            className="py-4"
          />
        </div>
      ) : (
        <ul className="space-y-0.5">
          {tags.map((tag) => {
            const isActive = activeTagId === tag.id;
            const palette =
              TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.gray;
            return (
              <li key={tag.id} className="group relative">
                <Link
                  href={`/all?tag=${encodeURIComponent(tag.id)}`}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-control px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "font-semibold text-fg bg-surface-muted/70"
                      : "font-medium text-fg-secondary hover:bg-surface-muted hover:text-fg",
                  )}
                >
                  <TagIcon
                    aria-hidden="true"
                    className={cn("h-4 w-4 shrink-0", palette.icon)}
                  />
                  <span className="truncate pr-6">{tag.name}</span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      label={`More options for ${tag.name}`}
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 data-[state=open]:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setRenaming(tag)}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem danger onSelect={() => setDeleting(tag)}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            );
          })}
        </ul>
      )}

      <TagFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <TagFormDialog
        open={renaming !== null}
        onOpenChange={(open) => {
          if (!open) setRenaming(null);
        }}
        tag={renaming}
      />
      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete tag"
        description="The tag is removed from every activity that uses it."
      >
        <p className="text-sm text-fg-secondary">
          Delete the tag &quot;{deleting?.name}&quot;?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={deleteMutation.isPending}
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
