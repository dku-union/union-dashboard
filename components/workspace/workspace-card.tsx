"use client";

import { Workspace, MemberRole } from "@/types/workspace";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, AppWindow, ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";
import { ROLE_LABELS } from "@/lib/constants";

interface WorkspaceCardProps {
  workspace: Workspace;
  currentUserRole: MemberRole;
}

export function WorkspaceCard({ workspace, currentUserRole }: WorkspaceCardProps) {
  return (
    <Link href={`/workspace/${workspace.id}`} className="block">
      <Card className="card-hover border-border/60 overflow-hidden group cursor-pointer h-full">
        {/* Color accent bar */}
        <div className="h-1" style={{ backgroundColor: workspace.color }} />

        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white heading-display text-sm font-bold"
                style={{ backgroundColor: workspace.color }}
              >
                {workspace.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">{workspace.name}</h3>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {ROLE_LABELS[currentUserRole]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {workspace.description}
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2 mt-1" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{workspace.members.length}명</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <AppWindow className="h-3.5 w-3.5" />
                <span>{workspace.appIds.length}개</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hidden sm:flex">
                <Calendar className="h-3 w-3" />
                <span>{workspace.createdAt}</span>
              </div>
            </div>

            <div className="flex -space-x-1.5">
              {workspace.members.slice(0, 4).map((m) => (
                <Avatar key={m.id} className="h-6 w-6 border-2 border-card">
                  <AvatarFallback className="text-[9px] bg-muted font-medium">
                    {m.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
              {workspace.members.length > 4 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] text-muted-foreground font-medium">
                  +{workspace.members.length - 4}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
