"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMiniAppDetail } from "@/hooks/use-app-versions";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";

const CATEGORIES = [
  { value: "ANNOUNCEMENT", label: "공지 (Announcement)" },
  { value: "UPDATE", label: "업데이트 (Update)" },
  { value: "RECOMMENDATION", label: "추천 (Recommendation)" },
  { value: "MINIAPP_GENERIC", label: "미니앱 일반 (Generic)" },
] as const;

const DEEPLINK_TYPES = [
  { value: "NONE", label: "없음 (인박스에만 표시)" },
  { value: "MINIAPP", label: "미니앱 내부 경로" },
  { value: "WEB", label: "외부 웹 URL" },
  { value: "INTERNAL", label: "Union 내부 라우트" },
] as const;

interface SendResult {
  campaignId: number;
  sentTokenCount: number;
  subscriberCount: number;
}

export default function NotificationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const numId = Number(id);
  const { app, isLoading: appLoading } = useMiniAppDetail(numId);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>("ANNOUNCEMENT");
  const [deeplinkType, setDeeplinkType] = useState<string>("NONE");
  const [targetPath, setTargetPath] = useState("");
  const [targetWebUrl, setTargetWebUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<SendResult | null>(null);

  const targetAppId = app?.appId;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!targetAppId) {
      toast.error("미니앱에 appId 가 설정되어 있어야 알림을 보낼 수 있습니다.");
      return;
    }
    if (!title.trim() || !body.trim()) {
      toast.error("제목과 본문을 입력해주세요.");
      return;
    }

    setIsSending(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/publisher/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAppId,
          title: title.trim(),
          body: body.trim(),
          category,
          deeplinkType,
          targetPath: deeplinkType === "MINIAPP" ? targetPath.trim() || undefined : undefined,
          targetWebUrl: deeplinkType === "WEB" ? targetWebUrl.trim() || undefined : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "발송에 실패했습니다.");
      }
      const result: SendResult = await res.json();
      setLastResult(result);
      toast.success(`발송 완료 — 구독자 ${result.subscriberCount}명, 전송 토큰 ${result.sentTokenCount}건`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "발송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/apps/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> 앱 상세로
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">알림 테스트 발송</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          이 화면에서는 본인 계정 인증(JWT)으로 즉시 발송할 수 있습니다. 운영 환경에선 발급받은 API Key 로 publisher 백엔드에서 호출하세요.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>대상 미니앱</CardTitle>
        </CardHeader>
        <CardContent>
          {appLoading ? (
            <p className="text-sm text-muted-foreground">로딩 중...</p>
          ) : !targetAppId ? (
            <p className="text-sm text-destructive">
              이 미니앱에 appId 가 설정되어 있지 않아 알림을 보낼 수 없습니다. 앱 상세에서 appId 를 먼저 등록해주세요.
            </p>
          ) : (
            <p className="font-mono text-sm">
              {app?.name} — <span className="text-muted-foreground">{targetAppId}</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 내용</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSend}>
            <div>
              <Label htmlFor="title">제목 (최대 120자)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="예: 주말 경기 일정 공지"
              />
            </div>

            <div>
              <Label htmlFor="body">본문 (최대 500자)</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={500}
                placeholder="예: 토요일 14시 운동장 집합"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>카테고리</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>딥링크 타입</Label>
                <Select value={deeplinkType} onValueChange={(v) => v && setDeeplinkType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEEPLINK_TYPES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {deeplinkType === "MINIAPP" && (
              <div>
                <Label htmlFor="path">미니앱 경로</Label>
                <Input
                  id="path"
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder="/matches/123"
                />
              </div>
            )}

            {deeplinkType === "WEB" && (
              <div>
                <Label htmlFor="webUrl">외부 URL</Label>
                <Input
                  id="webUrl"
                  value={targetWebUrl}
                  onChange={(e) => setTargetWebUrl(e.target.value)}
                  placeholder="https://example.com/event"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                구독한 사용자에게만 즉시 발송됩니다.
              </p>
              <Button type="submit" disabled={!targetAppId || isSending}>
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "발송 중..." : "발송"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {lastResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>최근 발송 결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              캠페인 ID: <code className="font-mono">{lastResult.campaignId}</code>
            </div>
            <div>구독자: {lastResult.subscriberCount}명</div>
            <div>전송 토큰: {lastResult.sentTokenCount}건</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
