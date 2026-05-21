import { Badge } from "@/components/ui/badge";
import type { MiniAppStatus } from "@/types/app-version";
import { MINI_APP_STATUS_LABELS, MINI_APP_STATUS_COLORS } from "@/lib/constants";

export function MiniAppStatusBadge({ status }: { status: MiniAppStatus }) {
  const config = MINI_APP_STATUS_COLORS[status];
  return (
    <Badge variant="secondary" className={`gap-1.5 font-medium text-[11px] ${config.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {MINI_APP_STATUS_LABELS[status]}
    </Badge>
  );
}
