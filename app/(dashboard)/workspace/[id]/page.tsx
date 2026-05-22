"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspaces";
import { MemberCard } from "@/components/workspace/member-card";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { MemberRole } from "@/types/workspace";
import { Badge } from "@/components/ui/badge";
import { MINI_APP_STATUS_LABELS, MINI_APP_STATUS_COLORS } from "@/lib/constants";
import {
  Users,
  UserPlus,
  AppWindow,
  ArrowLeft,
  Loader2,
  Clock,
  Mail,
  Search,
  Upload,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMiniAppList } from "@/hooks/use-app-versions";
import { toast } from "sonner";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [memberQuery, setMemberQuery] = useState("");
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
      <EmptyState
        icon={Users}
        title="워크스페이스를 찾을 수 없습니다"
        description="삭제되었거나 접근 권한이 없는 워크스페이스일 수 있습니다."
        action={{ label: "목록으로 돌아가기", href: "/workspace" }}
        className="animate-fade-up my-12"
      />
    );
  }

  const members = workspace.members ?? [];
  const pendingInvitations = workspace.pendingInvitations ?? [];
  const myRole = workspace.myRole as MemberRole;
  const canManage = myRole === "owner" || myRole === "admin";
  const canUploadApps = canManage || myRole === "developer";
  const canChangeRole = myRole === "owner";

  const roleStats = {
    owner: members.filter((m) => m.role === "owner").length,
    admin: members.filter((m) => m.role === "admin").length,
    developer: members.filter((m) => m.role === "developer").length,
    viewer: members.filter((m) => m.role === "viewer").length,
  };
  const filteredMembers = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.name ?? "", m.email ?? ""].some((field) => field.toLowerCase().includes(q)),
    );
  }, [members, memberQuery]);
  const approvedApps = miniApps.filter((app) => app.status === "APPROVED").length;
  const pendingApps = miniApps.filter((app) => app.status === "PENDING").length;

  return (
    <div className="publisher-page">
      <div className="publisher-page-header animate-fade-up">
        <div className="flex min-w-0 items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 h-8 w-8 shrink-0"
            onClick={() => router.push("/workspace")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white text-lg font-bold"
                style={{ backgroundColor: workspace.color }}
              >
                {workspace.name[0]}
              </div>
              <div className="min-w-0">
                <p className="publisher-eyebrow">Workspace</p>
                <h1 className="mt-1 truncate text-heading-1">{workspace.name}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {workspace.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-card/80 px-2.5 py-1">
                    <Mail className="h-3.5 w-3.5" />
                    {workspace.contactEmail}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-card/80 px-2.5 py-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {workspace.createdAt ? new Date(workspace.createdAt).toLocaleDateString("ko-KR") : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          {canManage && (
            <Button variant="outline" className="border-border/70" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-4 w-4" />
              멤버 초대
            </Button>
          )}
          {canUploadApps && (
            <Button className="bg-union text-white hover:bg-union/90" render={<Link href={`/workspace/${workspaceId}/upload`} />}>
              <Upload className="h-4 w-4" />
              앱 업로드
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-1">
        <Card className="publisher-panel">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="publisher-eyebrow">전체 멤버</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">{members.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">워크스페이스 접근 권한</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-union/10">
                <Users className="h-4 w-4 text-union" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="publisher-panel">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="publisher-eyebrow">관리 중인 앱</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">{appsLoading ? "-" : miniApps.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">등록된 미니앱</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/[0.04]">
                <AppWindow className="h-4 w-4 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="publisher-panel">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="publisher-eyebrow">승인됨</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">{appsLoading ? "-" : approvedApps}</p>
                <p className="mt-1 text-xs text-muted-foreground">배포 가능한 앱</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage/10">
                <CheckCircle2 className="h-4 w-4 text-sage" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="publisher-panel">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="publisher-eyebrow">대기 중</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">{appsLoading ? "-" : pendingApps}</p>
                <p className="mt-1 text-xs text-muted-foreground">검토 또는 승인 전</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                <Clock className="h-4 w-4 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="publisher-panel animate-fade-up delay-2">
          <CardContent className="p-4 sm:p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <p className="publisher-eyebrow">Workspace Apps</p>
                <h2 className="mt-1 text-lg font-semibold">워크스페이스 앱</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  워크스페이스 안의 앱 등록과 운영 상태를 한눈에 확인합니다.
                </p>
              </div>
              {canUploadApps && (
                <Button
                  className="bg-union text-white hover:bg-union/90"
                  render={<Link href={`/workspace/${workspaceId}/upload`} />}
                >
                  <Upload className="h-4 w-4" />
                  새 버전 업로드
                </Button>
              )}
            </div>

            {miniApps.length === 0 ? (
              <EmptyState
                icon={AppWindow}
                title="등록된 미니앱이 없습니다"
                description="개발이 완료되지 않았더라도 앱을 먼저 등록하고, 이후 빌드를 업로드해 심사와 배포를 진행할 수 있습니다."
                action={
                  canUploadApps
                    ? { label: "첫 미니앱 업로드", href: `/workspace/${workspaceId}/upload` }
                    : undefined
                }
                className="min-h-64"
              />
            ) : (
              <div className="space-y-3">
                {miniApps.map((app, index) => {
                  const statusConfig = MINI_APP_STATUS_COLORS[app.status];

                  return (
                    <Link key={app.id} href={`/apps/${app.id}`} className="block">
                      <div className={`publisher-row group animate-fade-up delay-${Math.min(index + 1, 8)} p-4`}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/55">
                            <AppWindow className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold">{app.name}</p>
                              <Badge variant="secondary" className={`gap-1.5 text-[11px] ${statusConfig.bg}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                                {MINI_APP_STATUS_LABELS[app.status]}
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                              {app.description || "설명 없음"}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/75">
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                수정 {new Date(app.updatedAt).toLocaleDateString("ko-KR")}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                상세 설정
                              </span>
                            </div>
                          </div>
                          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="publisher-panel animate-fade-up delay-3">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="publisher-eyebrow">Team</p>
                  <h2 className="mt-1 text-base font-semibold">팀 멤버</h2>
                </div>
                {canManage && (
                  <Button variant="outline" size="sm" className="border-border/70" onClick={() => setInviteOpen(true)}>
                    <UserPlus className="h-3.5 w-3.5" />
                    초대
                  </Button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="rounded-lg bg-muted/30 p-2 text-center">
                  <p className="text-sm font-semibold tabular-nums">{roleStats.owner}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">소유자</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 text-center">
                  <p className="text-sm font-semibold tabular-nums">{roleStats.admin}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">관리자</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 text-center">
                  <p className="text-sm font-semibold tabular-nums">{roleStats.developer}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">개발자</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 text-center">
                  <p className="text-sm font-semibold tabular-nums">{roleStats.viewer}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">뷰어</p>
                </div>
              </div>

              {members.length > 4 && (
                <div className="relative mt-4">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={memberQuery}
                    onChange={(e) => setMemberQuery(e.target.value)}
                    placeholder="멤버 이름·이메일 검색"
                    className="h-8 border-border/70 bg-card pl-8 text-xs"
                  />
                </div>
              )}

              <div className="mt-4 space-y-2">
                {filteredMembers.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    검색 결과가 없습니다.
                  </p>
                ) : (
                  filteredMembers.map((member, i) => (
                    <div key={member.id} className={`animate-fade-up delay-${Math.min(i + 3, 8)}`}>
                      <MemberCard
                        member={member}
                        canManage={canManage}
                        canChangeRole={canChangeRole}
                        onRoleChange={handleRoleChange}
                        onRemove={handleRemoveMember}
                      />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {pendingInvitations.length > 0 && canManage && (
            <Card className="publisher-panel animate-fade-up delay-4">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="publisher-eyebrow flex items-center gap-1.5 text-foreground">
                    <Clock className="h-3 w-3" />
                    대기 중인 초대
                  </h3>
                  <span className="text-[11px] font-mono text-muted-foreground">{pendingInvitations.length}</span>
                </div>
                <div className="space-y-2">
                  {pendingInvitations.map((inv: { id: number; email: string; role: string; createdAt: string }) => (
                    <div key={inv.id} className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-3">
                      <div className="flex items-center gap-3">
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="publisher-panel animate-fade-up delay-5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-union/10">
                  <Sparkles className="h-4 w-4 text-union" />
                </div>
                <div>
                  <p className="text-sm font-semibold">출시 전 체크</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    앱 등록 후 빌드를 업로드하고, 테스트 완료 상태에서 심사 요청으로 이어가세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
