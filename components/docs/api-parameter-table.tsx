import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export function ApiParameterTable({ parameters }: { parameters: Parameter[] }) {
  return (
    <div className="rounded-lg border border-border/40 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 bg-muted/30">
            <TableHead className="text-[10px] uppercase tracking-wider font-semibold">파라미터</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-semibold">타입</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-semibold">필수</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-semibold">설명</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parameters.map((param) => (
            <TableRow key={param.name} className="border-border/30">
              <TableCell>
                <code className="text-[12px] font-mono font-medium">{param.name}</code>
              </TableCell>
              <TableCell>
                <code className="text-[11px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">{param.type}</code>
              </TableCell>
              <TableCell>
                {param.required ? (
                  <span className="text-[10px] font-bold text-union bg-union/10 px-1.5 py-0.5 rounded">필수</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">선택</span>
                )}
              </TableCell>
              <TableCell className="text-[12px] text-muted-foreground">{param.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
