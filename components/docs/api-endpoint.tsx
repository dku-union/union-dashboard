import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  POST: "bg-sage/10 text-sage border-sage/20",
  PUT: "bg-gold/10 text-gold border-gold/20",
  DELETE: "bg-union/10 text-union border-union/20",
  AUTH: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  UI: "bg-sage/10 text-sage border-sage/20",
  DEVICE: "bg-gold/10 text-gold border-gold/20",
  STORAGE: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  NETWORK: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  ANALYTICS: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
};

interface ApiEndpointProps {
  method: string;
  path: string;
  description: string;
  children?: React.ReactNode;
}

export function ApiEndpoint({ method, path, description, children }: ApiEndpointProps) {
  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className={`font-mono text-[10px] font-bold tracking-wider ${methodColors[method] || ""}`}>
            {method}
          </Badge>
          <code className="text-sm font-mono font-medium">{path}</code>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardHeader>
      {children && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}
