"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload } from "lucide-react";

export function AppFormMedia() {
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleScreenshotAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files)
        .slice(0, 5 - screenshots.length)
        .map((f) => URL.createObjectURL(f));
      setScreenshots((prev) => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Icon Upload */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">앱 아이콘</label>
        <p className="text-[11px] text-muted-foreground/60 mb-3 mt-1">
          512x512px PNG 권장
        </p>
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/30 overflow-hidden hover:border-union/30 transition-colors">
            {iconPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconPreview}
                  alt="앱 아이콘 미리보기"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIconPreview(null)}
                  className="absolute -right-1 -top-1 rounded-full bg-union p-0.5 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <ImagePlus className="h-6 w-6 text-muted-foreground/40" />
            )}
          </div>
          <Button variant="outline" size="sm" className="border-border/60" render={<label className="cursor-pointer" />}>
            <Upload className="mr-1 h-4 w-4" />
            아이콘 업로드
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleIconChange}
            />
          </Button>
        </div>
      </div>

      {/* Screenshot Upload */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">스크린샷</label>
        <p className="text-[11px] text-muted-foreground/60 mb-3 mt-1">
          최대 5장, 앱 내 주요 화면을 캡처해주세요
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {screenshots.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[9/16] rounded-lg border border-border/60 overflow-hidden bg-muted/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`스크린샷 ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeScreenshot(i)}
                className="absolute right-1 top-1 rounded-full bg-union p-0.5 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {screenshots.length < 5 && (
            <label className="flex aspect-[9/16] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/20 hover:border-union/30 hover:bg-union/5 transition-colors">
              <div className="text-center">
                <ImagePlus className="mx-auto h-6 w-6 text-muted-foreground/40" />
                <span className="mt-1 text-[11px] text-muted-foreground/60">추가</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleScreenshotAdd}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
