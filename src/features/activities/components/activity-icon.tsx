import {
  BookOpen,
  ChefHat,
  CircleDot,
  Coffee,
  Dumbbell,
  Heart,
  Leaf,
  Mic,
  Moon,
  Music,
  PenTool,
  Sparkles,
  Sun,
  Telescope,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";

export const ACTIVITY_ICON_KEYS = [
  "telescope",
  "chef-hat",
  "sparkles",
  "mic",
  "book-open",
  "dumbbell",
  "music",
  "coffee",
  "heart",
  "sun",
  "moon",
  "pen-tool",
  "leaf",
] as const;

export type ActivityIconKey = (typeof ACTIVITY_ICON_KEYS)[number];

export interface ActivityIconProps {
  icon: string | null | undefined;
  className?: string;
}

export function ActivityIcon({ icon, className }: ActivityIconProps) {
  const classes = cn("h-5 w-5 shrink-0", className);
  switch (icon) {
    case "telescope":
      return <Telescope className={classes} aria-hidden="true" />;
    case "chef-hat":
      return <ChefHat className={classes} aria-hidden="true" />;
    case "sparkles":
      return <Sparkles className={classes} aria-hidden="true" />;
    case "mic":
      return <Mic className={classes} aria-hidden="true" />;
    case "book-open":
      return <BookOpen className={classes} aria-hidden="true" />;
    case "dumbbell":
      return <Dumbbell className={classes} aria-hidden="true" />;
    case "music":
      return <Music className={classes} aria-hidden="true" />;
    case "coffee":
      return <Coffee className={classes} aria-hidden="true" />;
    case "heart":
      return <Heart className={classes} aria-hidden="true" />;
    case "sun":
      return <Sun className={classes} aria-hidden="true" />;
    case "moon":
      return <Moon className={classes} aria-hidden="true" />;
    case "pen-tool":
      return <PenTool className={classes} aria-hidden="true" />;
    case "leaf":
      return <Leaf className={classes} aria-hidden="true" />;
    default:
      return <CircleDot className={classes} aria-hidden="true" />;
  }
}
