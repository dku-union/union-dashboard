import { Badge } from "@/components/ui/badge";
import type { VersionStatus } from "@/types/app-version";
import { VERSION_STATUS_LABELS, VERSION_STATUS_COLORS } from "@/lib/constants";

export function VersionStatusBadge({ status }: { status: VersionStatus }) {
  const config = VERSION_STATUS_COLORS[status];
  return (
    <Badge variant="secondary" className={`gap-1.5 font-medium text-[11px] ${config.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {VERSION_STATUS_LABELS[status]}
    </Badge>
  );
}
