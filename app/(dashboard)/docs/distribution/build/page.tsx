import { DocRenderer } from "@/components/docs/doc-renderer";
import { build } from "@/content/docs/distribution/build";

export default function BuildPage() {
  return (
    <div className="animate-fade-up">
      <DocRenderer page={build} />
    </div>
  );
}
