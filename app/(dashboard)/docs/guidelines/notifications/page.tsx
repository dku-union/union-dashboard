import { DocRenderer } from "@/components/docs/doc-renderer";
import { notifications } from "@/content/docs/guidelines/notifications";

export default function NotificationsGuidePage() {
  return (
    <div className="animate-fade-up">
      <DocRenderer page={notifications} />
    </div>
  );
}
