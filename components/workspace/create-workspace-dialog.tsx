"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layers, Check } from "lucide-react";
import { toast } from "sonner";

const PRESET_COLORS = [
  { label: "블루", value: "#2563EB" },
  { label: "그린", value: "#10B981" },
  { label: "퍼플", value: "#6366F1" },
  { label: "앰버", value: "#F59E0B" },
  { label: "로즈", value: "#E11D48" },
  { label: "시안", value: "#0891B2" },
];

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0].value);

  const handleCreate = () => {
    if (!name.trim()) return;
    toast.success("워크스페이스 생성 완료", {
      description: `"${name}" 워크스페이스가 생성되었습니다.`,
    });
    setName("");
    setDescription("");
    setColor(PRESET_COLORS[0].value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 heading-display">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: color + "1A" }}
            >
              <Layers className="h-4 w-4" style={{ color }} />
            </div>
            새 워크스페이스
          </DialogTitle>
          <DialogDescription>
            새로운 워크스페이스를 만들어 팀원들과 함께 미니앱을 관리하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
              워크스페이스 이름
            </label>
            <Input
              placeholder="예: 프로젝트 알파"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border/60"
            />
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
        </div>

        <DialogFooter>
          <Button variant="outline" className="border-border/60" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="text-white hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            <Layers className="mr-1 h-4 w-4" />
            만들기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
