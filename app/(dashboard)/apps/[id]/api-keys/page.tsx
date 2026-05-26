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

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/apps/${appId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> 앱 상세로
        </Link>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API 키</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Publisher 백엔드 서버에서 Union 으로 알림을 보낼 때 사용합니다. 키는 발급 직후 1회만 노출되니 안전하게 보관하세요.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> 새 키 발급
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex items-end gap-3" onSubmit={handleIssue}>
            <div className="flex-1">
              <Label htmlFor="key-name">키 이름</Label>
              <Input
                id="key-name"
                placeholder="예: production server, staging"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                disabled={isIssuing}
              />
            </div>
            <Button type="submit" disabled={!name.trim() || isIssuing}>
              {isIssuing ? "발급 중..." : "발급"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>발급된 키 ({keys.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : keys.length === 0 ? (
            <EmptyState
              icon={KeyRound}
              title="아직 발급된 키가 없습니다"
              description="위에서 첫 번째 키를 발급하세요."
            />
          ) : (
            <ul className="divide-y">
              {keys.map((k) => {
                const revoked = !!k.revokedAt;
                return (
                  <li key={k.id} className="flex items-center justify-between py-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{k.name}</span>
                        {revoked ? (
                          <Badge variant="outline">폐기됨</Badge>
                        ) : (
                          <Badge>활성</Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <code className="rounded bg-muted px-2 py-0.5 font-mono">
                          {k.keyPrefix}●●●●●●●●●●●●●●●●●●●●●●●●
                        </code>
                        <span>
                          발급:{" "}
                          {new Date(k.createdAt).toLocaleString("ko-KR")}
                        </span>
                        {k.lastUsedAt && (
                          <span>
                            마지막 사용:{" "}
                            {new Date(k.lastUsedAt).toLocaleString("ko-KR")}
                          </span>
                        )}
                      </div>
                    </div>
                    {!revoked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(k)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-1 h-4 w-4" /> 폐기
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
          <DialogTitle>API 키가 발급되었습니다</DialogTitle>
          <DialogDescription>
            이 키는 <strong>지금 한 번만</strong> 표시됩니다. 안전한 곳에 복사해 두세요. 창을 닫으면 다시 확인할 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">이름</Label>
            <p className="font-medium">{issued.name}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">키</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-muted p-3 font-mono text-sm break-all">
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
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-md bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <strong>사용 방법:</strong>{" "}
            <code className="font-mono">curl -H &quot;X-Union-Api-Key: {issued.rawKey.slice(0, 12)}...&quot; ...</code>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>저장 완료</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
