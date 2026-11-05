import { BookOpen, Sparkles, Telescope } from "lucide-react";

const BRAND_CARDS = [
  {
    title: "Observing",
    subtitle: "07:00 - 07:30",
    icon: Telescope,
  },
  {
    title: "Self Caring",
    subtitle: "11:00 - 12:00",
    icon: Sparkles,
  },
  {
    title: "Reading",
    subtitle: "16:00 - 17:30",
    icon: BookOpen,
  },
] as const;

export function AuthBrandPanel() {
  return (
    <aside
      aria-label="TODO App overview"
      className="flex h-full flex-col justify-between border-r border-line bg-navy bg-[radial-gradient(circle_at_85%_10%,color-mix(in_srgb,var(--berry)_55%,transparent),transparent_55%),radial-gradient(circle_at_10%_95%,color-mix(in_srgb,var(--accent)_50%,transparent),transparent_55%)] p-10 xl:p-14"
    >
      <div>
        <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-navy-fg">
          TODO App
        </span>
        <p className="mt-2 max-w-md text-sm text-navy-muted">
          Plan your habits, reminders and tasks in one place.
        </p>
      </div>

      <div className="my-auto py-8">
        <div className="grid max-w-lg grid-cols-3 gap-3.5">
          {BRAND_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="flex flex-col rounded-card border border-line bg-surface p-2.5 shadow-xs"
              >
                <div className="flex aspect-[16/10] w-full items-center justify-center rounded-[10px] bg-habit-lavender-bg text-habit-lavender-icon">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="mt-2.5 px-0.5">
                  <p className="truncate text-[14px] font-semibold leading-tight text-fg">
                    {card.title}
                  </p>
                  <p className="mt-1 text-[12px] text-fg-muted">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-navy-muted">
        Daily habits, scheduled reminders and kanban tasks.
      </p>
    </aside>
  );
}
