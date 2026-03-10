import { Badge } from "@/components/ui/badge";
import { MiniAppStatus } from "@/types/mini-app";
import { STATUS_LABELS } from "@/lib/constants";

const statusConfig: Record<MiniAppStatus, { dot: string; bg: string }> = {
  draft: { dot: "bg-muted-foreground/50", bg: "bg-muted text-muted-foreground" },
  in_review: { dot: "bg-gold", bg: "bg-gold/10 text-gold" },
  rejected: { dot: "bg-destructive", bg: "bg-destructive/10 text-destructive" },
  published: { dot: "bg-sage", bg: "bg-sage/10 text-sage" },
  suspended: { dot: "bg-gold", bg: "bg-gold/10 text-gold" },
};

export function StatusBadge({ status }: { status: MiniAppStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={`gap-1.5 font-medium text-[11px] ${config.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
