import type { ReactNode } from "react";
import type { Activity } from "../model/activity";

export interface ActivityDetailCardProps {
  activity: Activity;
  listSection?: ReactNode;
  tagsSection?: ReactNode;
}

export function ActivityDetailCard({
  activity,
  listSection,
  tagsSection,
}: ActivityDetailCardProps) {
  return (
    <div className="rounded-card bg-surface-muted p-4">
      <h2 className="text-base font-semibold text-fg">{activity.title}</h2>
      {activity.description ? (
        <p className="mt-2 text-xs leading-relaxed text-fg-secondary">
          {activity.description}
        </p>
      ) : (
        <p className="mt-2 text-xs text-fg-muted">No description provided.</p>
      )}

      <div className="my-4 h-px bg-line" />

      <div className="space-y-3.5">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-fg">List</p>
          <div className="flex flex-wrap items-center gap-3">
            {listSection ?? (
              <span className="text-xs text-fg-muted">No list</span>
            )}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-fg">Tags</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {tagsSection ?? (
              <span className="text-xs text-fg-muted">No tags</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
