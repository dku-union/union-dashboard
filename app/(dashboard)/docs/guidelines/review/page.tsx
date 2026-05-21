import { DocRenderer } from "@/components/docs/doc-renderer";
import { review } from "@/content/docs/guidelines/review";

export default function ReviewPage() {
  return (
    <div className="animate-fade-up">
      <DocRenderer page={review} />
    </div>
  );
}
