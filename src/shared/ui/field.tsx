import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/shared/lib/cn";

export interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const enhancedChild = isValidElement<{
    id?: string;
    "aria-describedby"?: string;
    invalid?: boolean;
  }>(children)
    ? cloneElement(children as ReactElement<{
        id?: string;
        "aria-describedby"?: string;
        invalid?: boolean;
      }>, {
        id: children.props.id ?? controlId,
        "aria-describedby":
          children.props["aria-describedby"] ?? describedBy,
        ...(error ? { invalid: true } : {}),
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={controlId}
        className="text-xs font-semibold text-fg-secondary"
      >
        {label}
      </label>
      {enhancedChild}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-tag-pink-fg">
          {error}
        </p>
      ) : null}
    </div>
  );
}
