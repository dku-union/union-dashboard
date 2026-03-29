"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Check, Mail, Loader2 } from "lucide-react";
import { useCreateWorkspace } from "@/hooks/use-workspaces";

const PRESET_COLORS = [
  { label: "블루", value: "#2563EB" },
  { label: "그린", value: "#10B981" },
  { label: "퍼플", value: "#6366F1" },
  { label: "앰버", value: "#F59E0B" },
  { label: "로즈", value: "#E11D48" },
  { label: "시안", value: "#0891B2" },
];

export default function NewWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0].value);
  const { createWorkspace, isCreating } = useCreateWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactEmail.trim()) return;

    const result = await createWorkspace({
      name: name.trim(),
      description: description.trim() || undefined,
      contactEmail: contactEmail.trim(),
      color,
    });

    if (result) {
      router.push("/workspace");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg border-border/60">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 transition-colors"
              style={{ backgroundColor: color + "1A" }}
            >
              <Layers className="h-7 w-7" style={{ color }} />
            </div>
            <h1 className="heading-display text-2xl tracking-tight">워크스페이스 만들기</h1>
            <p className="text-sm text-muted-foreground mt-2">
              미니앱을 배포하려면 먼저 워크스페이스를 만들어야 합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
                워크스페이스 이름
              </label>
              <Input
                placeholder="예: 프로젝트 알파"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-border/60"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
                대표 연락 이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  type="email"
                  placeholder="contact@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="pl-10 border-border/60"
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                심사 결과 알림 등 Union 운영 관련 연락에 사용됩니다.
              </p>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
                설명 (선택)
              </label>
              <Textarea
                placeholder="워크스페이스에 대한 간단한 설명을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-border/60 resize-none h-20"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3 block">
                테마 색상
              </label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setColor(preset.value)}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110"
                    style={{ backgroundColor: preset.value }}
                    title={preset.label}
                  >
                    {color === preset.value && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                    {color === preset.value && (
                      <div
                        className="absolute inset-[-3px] rounded-full border-2"
                        style={{ borderColor: preset.value }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || !contactEmail.trim() || isCreating}
              className="w-full text-white hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Layers className="mr-2 h-4 w-4" />
              )}
              워크스페이스 만들기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
