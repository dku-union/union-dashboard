"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  /**
   * - "card": border-dashed 박스로 감쌈 (목록/카드 본문에서 사용)
   * - "bare": wrapper 없이 부모 카드 안에 그대로 (CardContent 내부에서 사용)
   */
  variant?: "card" | "bare";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "card",
  className,
}: EmptyStateProps) {
  const innerClass =
    variant === "bare"
      ? "flex flex-col items-center justify-center py-10 text-center"
      : "flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-card/70 py-12 text-center";

  return (
    <div className={[innerClass, className].filter(Boolean).join(" ")}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50">
        <Icon className="h-6 w-6 text-muted-foreground/60" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Button
              variant="outline"
              size="sm"
              className="border-border/70"
              render={<Link href={action.href} />}
            >
              {action.label}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-border/70"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
