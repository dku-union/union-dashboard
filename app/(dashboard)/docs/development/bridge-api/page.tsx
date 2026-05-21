import { DocRenderer } from "@/components/docs/doc-renderer";
import { bridgeApi } from "@/content/docs/development/bridge-api";

export default function BridgeApiPage() {
  return (
    <div className="animate-fade-up">
      <DocRenderer page={bridgeApi} />
    </div>
  );
}
