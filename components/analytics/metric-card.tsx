"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MetricData } from "@/types/analytics";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  subtitle?: string;
  data: MetricData;
  icon?: React.ReactNode;
}

export function MetricCard({ title, subtitle, data, icon }: MetricCardProps) {
  const TrendIcon =
    data.trend === "up" ? TrendingUp : data.trend === "down" ? TrendingDown : Minus;

  const trendColor =
    data.trend === "up" ? "text-union" : data.trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="heading-display text-xs uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            {subtitle && (
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60">
            {icon}
          </div>
        </div>
        <p className="heading-display text-3xl tracking-tight">
          {data.value.toLocaleString()}
        </p>
        <div className={`flex items-center gap-1 mt-2 text-xs ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span className="font-medium">
            {data.change > 0 ? "+" : ""}
            {data.change}%
          </span>
          <span className="text-muted-foreground/60">전주 대비</span>
        </div>
      </CardContent>
    </Card>
  );
}
