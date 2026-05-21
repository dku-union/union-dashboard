import { DocRenderer } from "@/components/docs/doc-renderer";
import { submit } from "@/content/docs/distribution/submit";

export default function SubmitPage() {
  return (
    <div className="animate-fade-up">
      <DocRenderer page={submit} />
    </div>
  );
}
