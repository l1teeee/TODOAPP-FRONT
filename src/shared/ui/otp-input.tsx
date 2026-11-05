"use client";

import {
  forwardRef,
  useRef,
  type ClipboardEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/shared/lib/cn";

export interface OtpInputProps {
  id?: string;
  length: number;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  invalid?: boolean;
  disabled?: boolean;
  "aria-describedby"?: string;
  className?: string;
}

export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
  (
    {
      id,
      length,
      value,
      onChange,
      label = `${length}-digit verification code`,
      invalid,
      disabled,
      "aria-describedby": ariaDescribedBy,
      className,
    },
    forwardedRef,
  ) => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const chars = Array.from({ length: length }, (_, index) => {
      const ch = value[index];
      return ch && /\d/.test(ch) ? ch : "";
    });

    const focusBox = (index: number) => {
      const target = inputRefs.current[Math.max(0, Math.min(length - 1, index))];
      target?.focus();
      target?.select();
    };

    const setChars = (nextChars: string[]) => {
      onChange(nextChars.join(""));
    };

    const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
      const digits = event.target.value.replace(/\D/g, "");
      if (!digits) {
        const next = [...chars];
        next[index] = "";
        setChars(next);
        return;
      }

      if (digits.length > 1) {
        const next = [...chars];
        for (let i = 0; i < digits.length && index + i < length; i += 1) {
          next[index + i] = digits[i] ?? "";
        }
        setChars(next);
        focusBox(Math.min(index + digits.length, length - 1));
        return;
      }

      const next = [...chars];
      next[index] = digits[0] ?? "";
      setChars(next);
      if (index < length - 1) {
        focusBox(index + 1);
      }
    };

    const handleKeyDown = (
      index: number,
      event: KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        const next = [...chars];
        if (next[index]) {
          next[index] = "";
          setChars(next);
        } else if (index > 0) {
          next[index - 1] = "";
          setChars(next);
          focusBox(index - 1);
        }
        return;
      }

      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        focusBox(index - 1);
        return;
      }

      if (event.key === "ArrowRight" && index < length - 1) {
        event.preventDefault();
        focusBox(index + 1);
      }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pastedDigits = event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      if (!pastedDigits) return;

      const next = Array.from(
        { length: length },
        (_, i) => pastedDigits[i] ?? "",
      );
      setChars(next);
      focusBox(Math.min(pastedDigits.length, length - 1));
    };

    return (
      <div
        role="group"
        aria-label={label}
        style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
        className={cn("grid gap-2", className)}
      >
        {chars.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
              if (index === 0) {
                if (typeof forwardedRef === "function") {
                  forwardedRef(el);
                } else if (forwardedRef) {
                  forwardedRef.current = el;
                }
              }
            }}
            id={index === 0 ? id : undefined}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={invalid || undefined}
            aria-describedby={index === 0 ? ariaDescribedBy : undefined}
            disabled={disabled}
            value={digit}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={cn(
              "h-11 w-full rounded-control border bg-surface text-center text-base font-semibold text-fg transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
              invalid ? "border-tag-pink-fg" : "border-line",
            )}
          />
        ))}
      </div>
    );
  },
);

OtpInput.displayName = "OtpInput";
