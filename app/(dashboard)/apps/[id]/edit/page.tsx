"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircle,
  AppWindow,
  ArrowLeft,
  Info,
  Loader2,
  Save,
} from "lucide-react";
import { useMiniAppDetail } from "@/hooks/use-app-versions";
import { useWorkspace } from "@/hooks/use-workspaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

// NOTE: Spring 측 PATCH /mini-apps/{id} (이름/설명 수정) endpoint 구현 대기 중.
// 현재는 UI 프레임워크만 제공하며 저장 버튼은 비활성화 상태.
// endpoint 가 추가되면 SAVE_DISABLED 를 false 로 바꾸고 handleSave 안에서
// /api/mini-apps/{id} PATCH 호출 (BFF 라우트도 동일 시점에 활성화).
const SAVE_DISABLED = true;

export default function AppEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const numericId = Number(id);
  const { app, isLoading } = useMiniAppDetail(Number.isFinite(numericId) ? numericId : null);
  const { workspace } = useWorkspace(app?.workspaceId ?? "");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (app) {
      setName(app.name);
      setDescription(app.description ?? "");
    }
  }, [app]);

  const canEdit =
    workspace?.myRole === "owner" ||
    workspace?.myRole === "admin" ||
    workspace?.myRole === "developer";

  const isDirty = app
    ? name.trim() !== app.name || description.trim() !== (app.description ?? "")
    : false;

  const handleSave = async () => {
    if (SAVE_DISABLED) {
      toast.info("앱 정보 수정 API는 아직 백엔드 구현 대기 중입니다.");
      return;
    }
    if (!app || !isDirty) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/mini-apps/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "저장에 실패했습니다.");
        return;
      }
      toast.success("앱 정보가 저장되었습니다.");
      router.push(`/apps/${app.id}`);
    } catch {
      toast.error("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!app) {
    return (
      <EmptyState
        icon={AppWindow}
        title="앱을 찾을 수 없습니다"
        action={{ label: "목록으로 돌아가기", href: "/apps" }}
        className="animate-fade-up my-12"
      />
    );
  }

  if (!canEdit) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="편집 권한이 없습니다"
        description={`현재 역할: ${workspace?.myRole ?? "알 수 없음"}. 워크스페이스 관리자에게 권한 변경을 요청하세요.`}
        action={{ label: "앱 상세로 돌아가기", href: `/apps/${app.id}` }}
        className="animate-fade-up my-12"
      />
    );
  }

  return (
    <div className="publisher-page">
      <div className="publisher-page-header animate-fade-up">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 h-8 w-8 shrink-0"
            render={<Link href={`/apps/${app.id}`} />}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <p className="publisher-eyebrow">Mini App Edit</p>
            <h1 className="mt-1 text-heading-1 truncate">{app.name} 정보 편집</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              앱 이름과 설명을 수정할 수 있습니다. 아이콘은 앱 상세 페이지의 아이콘 변경 버튼으로 수정하세요.
            </p>
          </div>
        </div>
      </div>

      {SAVE_DISABLED && (
        <div className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-4 animate-fade-up">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">백엔드 구현 대기 중</p>
            <p className="text-xs leading-5 text-muted-foreground">
              앱 이름/설명 수정 API(<code className="rounded bg-card px-1.5 py-0.5 font-mono text-[11px]">PATCH /mini-apps/&#123;id&#125;</code>)는 아직 구현되지 않아
              저장 버튼이 비활성화되어 있습니다. Spring 측 endpoint 추가 후 활성화됩니다.
              현재 가능한 변경은 <strong>아이콘 교체</strong>(앱 상세에서) 뿐입니다.
            </p>
          </div>
        </div>
      )}

      <Card className="publisher-panel animate-fade-up delay-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="publisher-eyebrow" htmlFor="app-name">
              앱 이름
            </Label>
            <Input
              id="app-name"
              className="mt-1.5 border-border/60 bg-card"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="앱 이름"
              maxLength={100}
              disabled={SAVE_DISABLED}
            />
            <p className="mt-1 text-[11px] text-muted-foreground/60">
              앱 카탈로그에 노출되는 이름. 2~100자.
            </p>
          </div>
          <div>
            <Label className="publisher-eyebrow" htmlFor="app-description">
              설명 (선택)
            </Label>
            <Textarea
              id="app-description"
              className="mt-1.5 min-h-[120px] border-border/60 bg-card"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="앱에 대한 간단한 설명"
              maxLength={2000}
              disabled={SAVE_DISABLED}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3 animate-fade-up delay-2">
        <p className="text-xs text-muted-foreground">
          {isDirty ? "변경 사항이 있습니다." : "변경 없음"}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-border/60"
            render={<Link href={`/apps/${app.id}`} />}
          >
            취소
          </Button>
          <Button
            className="bg-union text-white hover:bg-union/90"
            disabled={SAVE_DISABLED || !isDirty || !name.trim() || isSaving}
            onClick={handleSave}
            title={SAVE_DISABLED ? "백엔드 구현 대기 중" : undefined}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
