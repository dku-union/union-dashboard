import { DocRenderer } from "@/components/docs/doc-renderer";
import { quickStart } from "@/content/docs/quick-start";

export default function QuickStartPage() {
  return (
    <div className="animate-fade-up">
      <DocRenderer page={quickStart} />
    </div>
  );
}
