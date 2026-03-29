"use client";

import { TeamMember, MemberRole } from "@/types/workspace";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, Trash2, Shield } from "lucide-react";

interface MemberCardProps {
  member: TeamMember;
  canManage?: boolean;
  canChangeRole?: boolean;
  onRoleChange?: (memberId: number, role: MemberRole) => void;
  onRemove?: (memberId: number) => void;
}

const roleAvatarColors: Record<string, string> = {
  owner: "bg-union/20 text-union",
  admin: "bg-gold/20 text-gold",
  developer: "bg-sage/20 text-sage",
  viewer: "bg-muted text-muted-foreground",
};

export function MemberCard({ member, canManage, canChangeRole, onRoleChange, onRemove }: MemberCardProps) {
  const availableRoles: MemberRole[] = ["admin", "developer", "viewer"];

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
          </div>

          {member.role !== "owner" && (canManage || canChangeRole) && (
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
                {canChangeRole && onRoleChange && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-[13px]">
                      <Shield className="mr-2 h-4 w-4" />
                      역할 변경
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {availableRoles
                        .filter((r) => r !== member.role)
                        .map((r) => (
                          <DropdownMenuItem
                            key={r}
                            className="text-[13px]"
                            onClick={() => onRoleChange(member.id, r)}
                          >
                            {ROLE_LABELS[r]}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                {canManage && onRemove && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-[13px] text-destructive"
                      onClick={() => onRemove(member.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      멤버 삭제
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40">
          <span className="text-[10px] text-muted-foreground/60">
            참여: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("ko-KR") : "-"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
