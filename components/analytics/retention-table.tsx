"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RetentionCohort } from "@/types/analytics";

function getRetentionColor(value: number): string {
  if (value === 0) return "";
  if (value >= 60) return "bg-sage/20 text-sage font-medium";
  if (value >= 40) return "bg-gold/15 text-gold font-medium";
  if (value >= 25) return "bg-union/10 text-union/80";
  return "bg-union/5 text-union/60";
}

export function RetentionTable({ data }: { data: RetentionCohort[] }) {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
          코호트 리텐션
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead className="text-[11px] uppercase tracking-wider">코호트</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wider">사용자</TableHead>
                {weeks.map((w) => (
                  <TableHead key={w} className="text-center text-[11px] uppercase tracking-wider">
                    {w}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((cohort) => (
                <TableRow key={cohort.cohort} className="border-border/40">
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {cohort.cohort}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    {cohort.users.toLocaleString()}
                  </TableCell>
                  {[
                    cohort.week1, cohort.week2, cohort.week3, cohort.week4,
                    cohort.week5, cohort.week6, cohort.week7, cohort.week8,
                  ].map((value, i) => (
                    <TableCell
                      key={i}
                      className={`text-center text-xs rounded ${getRetentionColor(value)}`}
                    >
                      {value > 0 ? `${value}%` : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
