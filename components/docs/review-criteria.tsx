import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReviewCriteriaDoc, ReviewSeverity } from "@/content/docs/types";

// Brand-aligned severity styling.
// Critical/Warning lean on Union Red (DESIGN.md core accent).
// Info uses charcoal hairline. Manual is a quiet neutral.
const severityMeta: Record<
  ReviewSeverity,
  {
    label: string;
    stripe: string;
    chip: string;
    label_color: string;
  }
> = {
  critical: {
    label: "Critical",
    stripe: "bg-union",
    chip: "bg-union text-white",
    label_color: "text-union",
  },
  warning: {
    label: "Warning",
    stripe: "bg-union/70",
    chip: "bg-union/15 text-union border border-union/30",
    label_color: "text-union/85",
  },
  info: {
    label: "Info",
    stripe: "bg-foreground",
    chip: "bg-foreground/10 text-foreground border border-foreground/20",
    label_color: "text-foreground/70",
  },
  manual: {
    label: "Manual",
    stripe: "bg-muted-foreground/40",
    chip: "bg-muted text-foreground/70 border border-border",
    label_color: "text-foreground/50",
  },
};

export function ReviewCriteria({ criteria }: { criteria: ReviewCriteriaDoc }) {
  const meta = severityMeta[criteria.severity];

  return (
    <Card className="relative overflow-hidden border-border bg-card">
      {/* full-height severity stripe — DESIGN.md: color not sole indicator */}
      <div
        aria-hidden
        className={cn("absolute left-0 top-0 bottom-0 w-1", meta.stripe)}
      />

      <CardContent className="p-5 pl-6 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold tracking-[0.15em] uppercase rounded",
              meta.chip,
            )}
          >
            {meta.label}
          </span>
          <code className="text-[13.5px] font-mono font-semibold text-foreground">
            {criteria.problem}
          </code>
          <span
            className={cn(
              "ml-auto text-[10px] uppercase tracking-wider font-medium",
              meta.label_color,
            )}
          >
            {criteria.detection === "validate" ? "validate 자동 감지" : "수동 심사"}
          </span>
        </div>
        <div className="grid gap-2.5 text-[13px] pt-1">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              왜 문제인가
            </p>
            <p className="leading-[1.65] text-foreground/80">
              {criteria.rationale}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-union font-semibold">
              수정 방법
            </p>
            <p className="leading-[1.65] text-foreground/80">{criteria.fix}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
