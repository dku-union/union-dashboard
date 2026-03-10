"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSeriesPoint } from "@/types/analytics";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface LineChartCardProps {
  title: string;
  data: TimeSeriesPoint[];
  color?: string;
}

export function LineChartCard({
  title,
  data,
  color = "var(--union)",
}: LineChartCardProps) {
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
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => v.slice(5)}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color, stroke: "var(--card)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
