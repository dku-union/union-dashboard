"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useBundleUrl } from "@/hooks/use-app-versions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Smartphone } from "lucide-react";

interface VersionTestModalProps {
  versionId: string;
  versionNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VersionTestModal({
  versionId,
  versionNumber,
  open,
  onOpenChange,
}: VersionTestModalProps) {
  const { getBundleUrl, isLoading } = useBundleUrl();
  const [bundleUrl, setBundleUrl] = useState<string | null>(null);

  const handleOpenChange = async (isOpen: boolean) => {
    if (isOpen && !bundleUrl) {
      const url = await getBundleUrl(versionId);
      setBundleUrl(url);
    }
    if (!isOpen) {
      setBundleUrl(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="heading-display text-lg">
            v{versionNumber} 테스트
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {isLoading ? (
            <div className="flex h-48 w-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-union" />
            </div>
          ) : bundleUrl ? (
            <>
              <div className="rounded-xl border border-border/60 p-4 bg-white">
                <QRCodeSVG
                  value={bundleUrl}
                  size={200}
                  level="M"
                />
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <Smartphone className="h-4 w-4 text-union" />
                  모바일 앱으로 QR을 스캔하세요
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Union 앱에서 해당 미니앱 버전이 실행됩니다.
                  <br />
                  테스트 완료 시 자동으로 기록됩니다.
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-8">
              번들 URL을 가져오지 못했습니다.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
