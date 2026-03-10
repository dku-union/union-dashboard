"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "var(--union)",
  "var(--gold)",
  "var(--sage)",
  "var(--chart-2)",
  "var(--muted-foreground)",
];

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
}

export function PieChartCard({ title, data }: PieChartCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
