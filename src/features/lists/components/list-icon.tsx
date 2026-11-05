import {
  BookOpen,
  Briefcase,
  Folder,
  Globe,
  PenTool,
  Zap,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface ListIconProps {
  icon: string;
  className?: string;
}

export function ListIcon({ icon, className }: ListIconProps) {
  const classes = cn("h-4 w-4 shrink-0", className);
  switch (icon) {
    case "briefcase":
      return <Briefcase className={classes} aria-hidden="true" />;
    case "pen-tool":
      return <PenTool className={classes} aria-hidden="true" />;
    case "zap":
      return <Zap className={classes} aria-hidden="true" />;
    case "globe":
      return <Globe className={classes} aria-hidden="true" />;
    case "book-open":
      return <BookOpen className={classes} aria-hidden="true" />;
    default:
      return <Folder className={classes} aria-hidden="true" />;
  }
}
