"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useTestSession } from "@/hooks/use-app-versions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Smartphone, RefreshCw, Clock } from "lucide-react";

interface VersionTestModalProps {
  versionId: string;
  versionNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 백엔드 토큰 TTL (서버는 10분 — application.yml의 정책과 일치).
const TOKEN_TTL_SECONDS = 10 * 60;

export function VersionTestModal({
  versionId,
  versionNumber,
  open,
  onOpenChange,
}: VersionTestModalProps) {
  const { createTestSession, isLoading } = useTestSession();
  const [testLink, setTestLink] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(TOKEN_TTL_SECONDS);

  // 모달 열릴 때 새 토큰 발급. 닫히면 상태 리셋.
  useEffect(() => {
    if (open && !testLink) {
      void createTestSession(versionId).then((link) => {
        setTestLink(link);
        setSecondsLeft(TOKEN_TTL_SECONDS);
      });
    }
    if (!open) {
      setTestLink(null);
      setSecondsLeft(TOKEN_TTL_SECONDS);
    }
  }, [open, versionId, testLink, createTestSession]);

  // 남은 시간 카운트다운 — 만료 시 사용자에게 시각적으로 즉시 알림.
  useEffect(() => {
    if (!open || !testLink) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [open, testLink]);

  const isExpired = secondsLeft <= 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleRegenerate = async () => {
    setTestLink(null);
    const link = await createTestSession(versionId);
    setTestLink(link);
    setSecondsLeft(TOKEN_TTL_SECONDS);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="heading-display text-lg">
            v{versionNumber} 테스트
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {isLoading && !testLink ? (
            <div className="flex h-48 w-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-union" />
            </div>
          ) : testLink ? (
            <>
              <div
                className={`relative rounded-xl border border-border/60 bg-white p-4 transition-opacity ${
                  isExpired ? "opacity-30" : "opacity-100"
                }`}
              >
                <QRCodeSVG value={testLink} size={200} level="M" />
                {isExpired && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/40">
                    <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                      만료됨
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <Smartphone className="h-4 w-4 text-union" />
                  Union 앱으로 QR을 스캔하세요
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="tabular-nums">
                    {isExpired
                      ? "토큰이 만료되었습니다."
                      : `${minutes}:${seconds.toString().padStart(2, "0")} 후 만료`}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  1회용 토큰 링크입니다. 외부에 공유하지 마세요.
                </p>
              </div>

              {isExpired && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  새 링크 발급
                </Button>
              )}
            </>
          ) : (
            <p className="py-8 text-sm text-muted-foreground">
              테스트 링크를 발급하지 못했습니다.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
