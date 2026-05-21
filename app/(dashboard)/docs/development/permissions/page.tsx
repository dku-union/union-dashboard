import { DocRenderer } from "@/components/docs/doc-renderer";
import { permissions } from "@/content/docs/development/permissions";

export default function PermissionsPage() {
  return (
    <div className="animate-fade-up">
      <DocRenderer page={permissions} />
    </div>
  );
}
