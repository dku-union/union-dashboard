"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockWorkspaces } from "@/data/workspace";
import { mockMiniApps } from "@/data/mini-apps";
import { MemberCard } from "@/components/workspace/member-card";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import { StatusBadge } from "@/components/apps/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  AppWindow,
  Settings,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);

  const workspace = mockWorkspaces.find((ws) => ws.id === params.id);

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">워크스페이스를 찾을 수 없습니다.</p>
        <Button variant="outline" onClick={() => router.push("/workspace")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const members = workspace.members;
  const apps = mockMiniApps.filter((app) => workspace.appIds.includes(app.id));

  const appNameMap: Record<string, string> = {};
  mockMiniApps.forEach((app) => {
    appNameMap[app.id] = app.name;
  });

  const roleStats = {
    owner: members.filter((m) => m.role === "owner").length,
    admin: members.filter((m) => m.role === "admin").length,
    developer: members.filter((m) => m.role === "developer").length,
    viewer: members.filter((m) => m.role === "viewer").length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between animate-fade-up">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 mt-0.5 shrink-0"
            onClick={() => router.push("/workspace")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white heading-display text-sm font-bold shrink-0"
                style={{ backgroundColor: workspace.color }}
              >
                {workspace.name[0]}
              </div>
              <div>
                <h1 className="heading-display text-2xl tracking-tight">{workspace.name}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {workspace.description}
                </p>
              </div>
            </div>
            <div className="h-0.5 w-8 mt-3" style={{ backgroundColor: workspace.color }} />
          </div>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-union text-white hover:bg-union/90">
          <UserPlus className="mr-2 h-4 w-4" />
          멤버 초대
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-4 animate-fade-up delay-1">
        <Card className="border-border/60 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-union/10 to-union/5 border border-union/10">
                <Users className="h-5 w-5 text-union/70" />
              </div>
              <div>
                <p className="heading-display text-2xl">{members.length}</p>
                <p className="text-xs text-muted-foreground">전체 멤버</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-union/10 to-union/5 border border-union/10">
                <AppWindow className="h-5 w-5 text-union/70" />
              </div>
              <div>
                <p className="heading-display text-2xl">{workspace.appIds.length}</p>
                <p className="text-xs text-muted-foreground">관리 중인 앱</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sage/10 to-sage/5 border border-sage/10">
                <Settings className="h-5 w-5 text-sage/70" />
              </div>
              <div>
                <p className="heading-display text-2xl">{roleStats.developer}</p>
                <p className="text-xs text-muted-foreground">개발자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/10">
                <Users className="h-5 w-5 text-gold/70" />
              </div>
              <div>
                <p className="heading-display text-2xl">{roleStats.admin + roleStats.viewer}</p>
                <p className="text-xs text-muted-foreground">관리자 + 뷰어</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Members List */}
        <div className="lg:col-span-3 space-y-4 animate-fade-up delay-2">
          <h2 className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
            팀 멤버 ({members.length})
          </h2>
          <div className="space-y-3">
            {members.map((member, i) => (
              <div key={member.id} className={`animate-fade-up delay-${Math.min(i + 3, 8)}`}>
                <MemberCard member={member} appNames={appNameMap} />
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Apps */}
        <div className="lg:col-span-2 space-y-4 animate-fade-up delay-3">
          <h2 className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
            워크스페이스 앱
          </h2>
          <div className="space-y-2">
            {apps.length > 0 ? (
              apps.map((app) => (
                <Card key={app.id} className="border-border/60 card-hover accent-line overflow-hidden">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-3 justify-start text-left group"
                    render={<Link href={`/apps/${app.id}`} />}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-union/10 to-union/5 shrink-0">
                        <AppWindow className="h-4 w-4 text-union/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{app.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StatusBadge status={app.status} />
                          <span className="text-[10px] text-muted-foreground font-mono">v{app.currentVersion}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex -space-x-1.5">
                          {members
                            .filter((m) => m.assignedApps.includes(app.id))
                            .slice(0, 3)
                            .map((m) => (
                              <Avatar key={m.id} className="h-5 w-5 border border-card">
                                <AvatarFallback className="text-[8px] bg-muted">{m.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                      </div>
                    </div>
                  </Button>
                </Card>
              ))
            ) : (
              <Card className="border-border/60 border-dashed">
                <CardContent className="p-6 flex flex-col items-center gap-2 text-muted-foreground">
                  <AppWindow className="h-6 w-6" />
                  <p className="text-sm">아직 등록된 앱이 없습니다</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
