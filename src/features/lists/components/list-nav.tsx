"use client";

import { Folder, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
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
import { useDeleteList, useLists } from "../api/use-lists";
import type { List } from "../model/list";
import { ListFormDialog } from "./list-form-dialog";
import { ListIcon } from "./list-icon";

export interface ListNavProps {
  activeListId?: string | null;
  onNavigate?: () => void;
}

export function ListNav({ activeListId, onNavigate }: ListNavProps) {
  const router = useRouter();
  const { data: lists, isLoading } = useLists();
  const deleteMutation = useDeleteList();

  const [createOpen, setCreateOpen] = useState(false);
  const [renaming, setRenaming] = useState<List | null>(null);
  const [deleting, setDeleting] = useState<List | null>(null);

  const handleConfirmDelete = () => {
    if (!deleting) return;
    const target = deleting;
    deleteMutation.mutate(target.id, {
      onSuccess: () => {
        setDeleting(null);
        if (activeListId === target.id) {
          router.push("/all");
        }
      },
    });
  };

  return (
    <div className="space-y-1.5" aria-busy={isLoading}>
      <div className="flex items-center justify-between pl-3 pr-3">
        <p className="text-xs font-semibold text-fg">Lists</p>
        <IconButton
          label="New list"
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
      ) : !lists || lists.length === 0 ? (
        <div className="px-3">
          <EmptyState
            icon={<Folder className="h-4 w-4" aria-hidden="true" />}
            title="No lists yet"
            action={
              <IconButton label="New list" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            }
            className="py-4"
          />
        </div>
      ) : (
        <ul className="space-y-0.5">
          {lists.map((list) => {
            const isActive = activeListId === list.id;
            return (
              <li key={list.id} className="group relative">
                <Link
                  href={`/all?list=${encodeURIComponent(list.id)}`}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-control px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "font-semibold text-fg bg-surface-muted/70"
                      : "font-medium text-fg-secondary hover:bg-surface-muted hover:text-fg",
                  )}
                >
                  <ListIcon icon={list.icon} className="h-4 w-4" />
                  <span className="truncate pr-6">{list.name}</span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      label={`More options for ${list.name}`}
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 data-[state=open]:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setRenaming(list)}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem danger onSelect={() => setDeleting(list)}>
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

      <ListFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ListFormDialog
        open={renaming !== null}
        onOpenChange={(open) => {
          if (!open) setRenaming(null);
        }}
        list={renaming}
      />
      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete list"
        description="Activities in this list are kept and become unassigned."
      >
        <p className="text-sm text-fg-secondary">
          Delete the list &quot;{deleting?.name}&quot;?
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
