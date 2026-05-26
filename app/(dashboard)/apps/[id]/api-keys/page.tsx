"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Copy, KeyRound, Trash2 } from "lucide-react";

interface ApiKey {
  id: number;
  keyPrefix: string;
  name: string;
  scopes: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

interface IssuedKey extends ApiKey {
  rawKey: string;
}

const NAME_MAX = 100;

export default function ApiKeysPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: appId } = use(params);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);
  const [name, setName] = useState("");
  const [justIssued, setJustIssued] = useState<IssuedKey | null>(null);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/publisher/api-keys");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "키 목록을 불러오지 못했습니다.");
      }
      const data: ApiKey[] = await res.json();
      setKeys(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "키 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setIsIssuing(true);
    try {
      const res = await fetch("/api/publisher/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "키 발급에 실패했습니다.");
      }
      const issued: IssuedKey = await res.json();
      setJustIssued(issued);
      setName("");
      await fetchKeys();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "키 발급에 실패했습니다.");
    } finally {
      setIsIssuing(false);
    }
  }

  async function handleRevoke(key: ApiKey) {
    if (!confirm(`"${key.name}" 키를 폐기하시겠습니까? 이후 이 키로는 알림 발송이 불가합니다.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/publisher/api-keys/${key.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "폐기에 실패했습니다.");
      }
      toast.success("API 키를 폐기했습니다.");
      await fetchKeys();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "폐기에 실패했습니다.");
    }
  }

  const activeKeysCount = keys.filter((k) => !k.revokedAt).length;
  const charCount = name.length;
  const charNearLimit = charCount > NAME_MAX * 0.8;

  return (
    <div className="publisher-page max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <div>
        <Link
          href={`/apps/${appId}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 앱 상세로
        </Link>
      </div>

      {/* Page header */}
      <header className="publisher-page-header">
        <div className="space-y-2">
          <p className="publisher-eyebrow">API Keys</p>
          <h1 className="text-heading-1">API 키 관리</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Publisher 백엔드 서버에서 Union 으로 알림을 보낼 때 사용합니다.
            발급 직후 표시되는 raw key 는 <strong className="font-semibold text-foreground">한 번만</strong> 노출되니
            안전한 환경변수 저장소에 옮겨두세요.
          </p>
        </div>
      </header>

      {/* Issue form */}
      <Card className="publisher-panel">
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <KeyRound className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="text-[15px] font-semibold tracking-tight">
                새 키 발급
              </CardTitle>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                사용처를 알아볼 수 있는 이름을 정하세요. 예: <code className="font-mono">production-server</code>, <code className="font-mono">staging</code>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={handleIssue}>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="key-name" className="text-[13px] font-medium">
                  키 이름
                </Label>
                <span
                  className={`text-[11px] font-mono ${
                    charNearLimit ? "text-warning" : "text-muted-foreground"
                  }`}
                >
                  {charCount} / {NAME_MAX}
                </span>
              </div>
              <Input
                id="key-name"
                placeholder="예: production-server"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX}
                disabled={isIssuing}
                autoComplete="off"
                className="h-10"
              />
              <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                키 자체는 모든 publisher 미니앱에 대해 발송 권한을 가집니다. 환경별로 다른 키를 발급해
                사용 범위를 분리하는 것을 권장합니다.
              </p>
            </div>
            <Separator className="bg-border/60" />
            <div className="flex items-center justify-end gap-3">
              <p className="text-[11.5px] text-muted-foreground mr-auto">
                발급된 키는 즉시 사용 가능합니다.
              </p>
              <Button
                type="submit"
                disabled={!name.trim() || isIssuing}
                className="bg-union text-white hover:bg-union/90 h-9 px-5 font-semibold"
              >
                <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                {isIssuing ? "발급 중..." : "키 발급"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="publisher-panel">
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[15px] font-semibold tracking-tight">
                발급된 키
              </CardTitle>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                활성 {activeKeysCount}개 · 전체 {keys.length}개
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          {isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : keys.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon={KeyRound}
                title="아직 발급된 키가 없습니다"
                description="위에서 첫 번째 키를 발급해주세요."
                variant="bare"
              />
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {keys.map((k) => {
                const revoked = !!k.revokedAt;
                return (
                  <li
                    key={k.id}
                    className="publisher-row flex items-center justify-between gap-4 p-4"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{k.name}</span>
                        {revoked ? (
                          <Badge
                            variant="outline"
                            className="h-5 px-1.5 text-[10px] font-medium"
                          >
                            폐기됨
                          </Badge>
                        ) : (
                          <Badge className="h-5 bg-sage/15 px-1.5 text-[10px] font-medium text-sage-foreground hover:bg-sage/15">
                            활성
                          </Badge>
                        )}
                      </div>
                      <code className="block max-w-fit truncate rounded bg-muted/60 px-2 py-1 text-[11px] font-mono tracking-wide text-foreground/70">
                        {k.keyPrefix}
                        <span className="text-foreground/35">●●●●●●●●●●●●●●●●●●●●●●●●</span>
                      </code>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span>
                          발급: {new Date(k.createdAt).toLocaleString("ko-KR")}
                        </span>
                        {k.lastUsedAt && (
                          <span>
                            마지막 사용:{" "}
                            {new Date(k.lastUsedAt).toLocaleString("ko-KR")}
                          </span>
                        )}
                        {revoked && (
                          <span>
                            폐기:{" "}
                            {new Date(k.revokedAt!).toLocaleString("ko-KR")}
                          </span>
                        )}
                      </div>
                    </div>
                    {!revoked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(k)}
                        className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> 폐기
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <IssuedKeyDialog
        issued={justIssued}
        onClose={() => setJustIssued(null)}
      />
    </div>
  );
}

function IssuedKeyDialog({
  issued,
  onClose,
}: {
  issued: IssuedKey | null;
  onClose: () => void;
}) {
  if (!issued) return null;

  return (
    <Dialog open={!!issued} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-union" />
            API 키가 발급되었습니다
          </DialogTitle>
          <DialogDescription>
            이 키는 <strong>지금 한 번만</strong> 표시됩니다. 안전한 곳에
            복사해 두세요. 창을 닫으면 다시 확인할 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              이름
            </Label>
            <p className="text-sm font-medium">{issued.name}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              키
            </Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md border border-border bg-muted/50 p-3 font-mono text-[12.5px] break-all leading-relaxed">
                {issued.rawKey}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(issued.rawKey);
                  toast.success("클립보드에 복사되었습니다.");
                }}
                aria-label="복사"
                className="h-10 w-10 shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-[12px] leading-relaxed">
            <p className="mb-1 font-semibold text-foreground">사용 예시</p>
            <code className="block font-mono text-foreground/70 break-all">
              curl -H &quot;X-Union-Api-Key: {issued.rawKey.slice(0, 12)}...&quot; ...
            </code>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-union text-white hover:bg-union/90">
            저장 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
