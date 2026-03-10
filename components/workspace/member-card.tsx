"use client";

import { TeamMember } from "@/types/workspace";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, AppWindow, Trash2 } from "lucide-react";

interface MemberCardProps {
  member: TeamMember;
  appNames: Record<string, string>;
}

const roleAvatarColors: Record<string, string> = {
  owner: "bg-union/20 text-union",
  admin: "bg-gold/20 text-gold",
  developer: "bg-sage/20 text-sage",
  viewer: "bg-muted text-muted-foreground",
};

export function MemberCard({ member, appNames }: MemberCardProps) {
  return (
    <Card className="border-border/60 card-hover group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className={`h-10 w-10 ${roleAvatarColors[member.role]}`}>
            <AvatarFallback className={`text-sm font-semibold ${roleAvatarColors[member.role]}`}>
              {member.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold truncate">{member.name}</p>
              <Badge variant="secondary" className={`text-[10px] ${ROLE_COLORS[member.role]}`}>
                {ROLE_LABELS[member.role]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{member.email}</p>

            {member.assignedApps.length > 0 && (
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <AppWindow className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                {member.assignedApps.slice(0, 3).map((appId) => (
                  <span key={appId} className="text-[10px] text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded">
                    {appNames[appId] || appId}
                  </span>
                ))}
                {member.assignedApps.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{member.assignedApps.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            }>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-[13px]">
                <Mail className="mr-2 h-4 w-4" />
                이메일 보내기
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px]">
                <AppWindow className="mr-2 h-4 w-4" />
                앱 할당 관리
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {member.role !== "owner" && (
                <DropdownMenuItem className="text-[13px] text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  멤버 삭제
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40">
          <span className="text-[10px] text-muted-foreground/60">
            참여: {member.joinedAt}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            최근 활동: {member.lastActiveAt}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
