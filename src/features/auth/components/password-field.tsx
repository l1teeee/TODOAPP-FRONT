"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";
import { Field } from "@/shared/ui/field";
import { IconButton } from "@/shared/ui/icon-button";
import { Input } from "@/shared/ui/input";

export interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
  error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, id, hint, error, className, disabled, ...props }, ref) => {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const [visible, setVisible] = useState(false);

    const hintId = hint ? `${controlId}-hint` : undefined;
    const errorId = error ? `${controlId}-error` : undefined;
    const describedBy =
      [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <Field label={label} htmlFor={controlId} hint={hint} error={error}>
        <div className="relative">
          <Input
            ref={ref}
            id={controlId}
            type={visible ? "text" : "password"}
            invalid={Boolean(error)}
            aria-describedby={describedBy}
            disabled={disabled}
            className={cn("pr-10", className)}
            {...props}
          />
          <IconButton
            label={visible ? "Hide password" : "Show password"}
            size="sm"
            disabled={disabled}
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </Field>
    );
  },
);

PasswordField.displayName = "PasswordField";
