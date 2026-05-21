"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checklist({ children }: { children: ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function ChecklistItem({
  id,
  children,
  detail,
}: {
  id: string;
  children: ReactNode;
  detail?: string;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "group w-full flex items-start gap-3 rounded-xl border bg-card px-4 py-3.5 text-left transition-all duration-200",
          checked
            ? "border-union/40 bg-union/[0.03]"
            : "border-border hover:border-foreground/30 hover:bg-card",
        )}
        aria-pressed={checked}
        aria-describedby={detail ? `${id}-detail` : undefined}
      >
        <span
          className={cn(
            "relative mt-0.5 h-5 w-5 shrink-0 grid place-items-center rounded-md border-[1.5px] transition-all duration-200",
            checked
              ? "bg-union border-union shadow-[0_0_0_4px_rgba(232,58,51,0.12)]"
              : "border-border bg-card group-hover:border-foreground/40",
          )}
          aria-hidden
        >
          {checked && (
            <Check
              className="h-3.5 w-3.5 stroke-[3] text-white animate-in zoom-in-50 duration-200"
            />
          )}
        </span>
        <span className="flex-1 space-y-0.5 pt-0.5">
          <span
            className={cn(
              "block text-[13.5px] leading-[1.6] transition-colors",
              checked
                ? "text-foreground/45 line-through decoration-union/40 decoration-[1.5px]"
                : "text-foreground",
            )}
          >
            {children}
          </span>
          {detail && (
            <span
              id={`${id}-detail`}
              className={cn(
                "block text-[12px] leading-[1.5] transition-colors",
                checked ? "text-foreground/30" : "text-muted-foreground",
              )}
            >
              {detail}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

