import { DocRenderer } from "@/components/docs/doc-renderer";
import { config } from "@/content/docs/development/config";

export default function ConfigPage() {
  return (
    <div className="animate-fade-up">
      <DocRenderer page={config} />
    </div>
  );
}
