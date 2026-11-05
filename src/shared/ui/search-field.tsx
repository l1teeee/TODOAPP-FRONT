"use client";

import { Search, X } from "lucide-react";
import { useId } from "react";
import { cn } from "@/shared/lib/cn";
import { IconButton } from "./icon-button";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  className,
}: SearchFieldProps) {
  const id = useId();

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 h-4 w-4 text-fg-muted"
      />
      <input
        id={id}
        name="q"
        type="search"
        aria-label="Search activities"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-control border border-line bg-surface pl-10 pr-9 text-sm text-fg placeholder:text-fg-muted transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <div className="absolute right-1.5">
          <IconButton
            label="Clear search"
            size="sm"
            onClick={() => onChange("")}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </IconButton>
        </div>
      ) : null}
    </div>
  );
}
