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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABELS } from "@/lib/constants";
import { MemberRole } from "@/types/workspace";
import { UserPlus, Mail } from "lucide-react";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("developer");

  const handleInvite = () => {
    if (!email) return;
    toast.success("초대 발송 완료", {
      description: `${email}로 초대 이메일이 발송되었습니다.`,
    });
    setEmail("");
    setRole("developer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 heading-display">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-union/10">
              <UserPlus className="h-4 w-4 text-union" />
            </div>
            멤버 초대
          </DialogTitle>
          <DialogDescription>
            워크스페이스에 새로운 팀원을 초대합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
              이메일 주소
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                type="email"
                placeholder="colleague@dankook.ac.kr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-border/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
              역할
            </label>
            <Select value={role} onValueChange={(v) => setRole(v as MemberRole)}>
              <SelectTrigger className="border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(ROLE_LABELS) as [MemberRole, string][])
                  .filter(([r]) => r !== "owner")
                  .map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground/60 mt-1.5">
              {role === "admin" && "워크스페이스 설정 변경, 멤버 관리, 모든 앱 관리 권한"}
              {role === "developer" && "할당된 미니앱의 개발, 빌드 제출, 분석 조회 권한"}
              {role === "viewer" && "할당된 미니앱의 정보 및 분석 조회만 가능"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="border-border/60" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleInvite} disabled={!email} className="bg-union text-white hover:bg-union/90">
            <UserPlus className="mr-1 h-4 w-4" />
            초대 보내기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
