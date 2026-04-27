"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspaces";
import { MemberCard } from "@/components/workspace/member-card";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemberRole } from "@/types/workspace";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  AppWindow,
  Settings,
  ArrowLeft,
  Loader2,
  Clock,
  Mail,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useMiniAppList } from "@/hooks/use-app-versions";
import { toast } from "sonner";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const workspaceId = params.id as string;
  const { workspace, isLoading, refetch } = useWorkspace(workspaceId);
  const { apps: miniApps, isLoading: appsLoading } = useMiniAppList(workspaceId);

  const handleRoleChange = async (memberId: number, role: MemberRole) => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "역할 변경에 실패했습니다.");
        return;
      }
      toast.success("역할이 변경되었습니다.");
      refetch();
    } catch {
      toast.error("역할 변경 중 오류가 발생했습니다.");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "멤버 삭제에 실패했습니다.");
        return;
      }
      toast.success("멤버가 삭제되었습니다.");
      refetch();
    } catch {
      toast.error("멤버 삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

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

  const members = workspace.members ?? [];
  const pendingInvitations = workspace.pendingInvitations ?? [];
  const myRole = workspace.myRole as MemberRole;
  const canManage = myRole === "owner" || myRole === "admin";
  const canChangeRole = myRole === "owner";

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
        {canManage && (
          <Button onClick={() => setInviteOpen(true)} className="bg-union text-white hover:bg-union/90">
            <UserPlus className="mr-2 h-4 w-4" />
            멤버 초대
          </Button>
        )}
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
                <p className="heading-display text-2xl">{appsLoading ? "-" : miniApps.length}</p>
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
                <MemberCard
                  member={member}
                  canManage={canManage}
                  canChangeRole={canChangeRole}
                  onRoleChange={handleRoleChange}
                  onRemove={handleRemoveMember}
                />
              </div>
            ))}
          </div>

          {pendingInvitations.length > 0 && canManage && (
            <div className="mt-6 space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                대기 중인 초대 ({pendingInvitations.length})
              </h3>
              {pendingInvitations.map((inv: { id: number; email: string; role: string; createdAt: string }) => (
                <Card key={inv.id} className="border-border/60 border-dashed">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{inv.email}</p>
                      <p className="text-[10px] text-muted-foreground/60">
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("ko-KR") : ""}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {inv.role} · 대기중
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Mini-apps */}
        <div className="lg:col-span-2 space-y-4 animate-fade-up delay-3">
          <div className="flex items-center justify-between">
            <h2 className="heading-display text-sm uppercase tracking-wider text-muted-foreground">
              워크스페이스 앱 ({miniApps.length})
            </h2>
            {canManage && (
              <Button
                size="sm"
                className="bg-union text-white hover:bg-union/90 h-8 text-xs"
                render={<Link href={`/workspace/${workspaceId}/upload`} />}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                업로드
              </Button>
            )}
          </div>
          {miniApps.length === 0 ? (
            <Card className="border-border/60 border-dashed">
              <CardContent className="p-6 flex flex-col items-center gap-2 text-muted-foreground">
                <AppWindow className="h-6 w-6" />
                <p className="text-sm">등록된 미니앱이 없습니다</p>
                {canManage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-border/60 text-xs"
                    render={<Link href={`/workspace/${workspaceId}/upload`} />}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    첫 미니앱 업로드
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {miniApps.map((app) => (
                <Link key={app.id} href={`/apps/${app.id}`}>
                  <Card className="border-border/60 card-hover cursor-pointer">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-union/10 to-union/5 border border-union/10 shrink-0">
                        <AppWindow className="h-4 w-4 text-union/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{app.name}</p>
                        {app.description && (
                          <p className="text-[11px] text-muted-foreground truncate">{app.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {app.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        workspaceId={workspaceId}
        onInvited={refetch}
      />
    </div>
  );
}
