"use client";

import { AppForm } from "@/components/apps/app-form";
import { useMiniApps } from "@/hooks/use-mini-apps";
import { useRouter } from "next/navigation";
import { MiniAppFormValues } from "@/lib/validations";
import { toast } from "sonner";

export default function NewAppPage() {
  const { createApp, submitForReview } = useMiniApps();
  const router = useRouter();

  const handleSaveDraft = (data: MiniAppFormValues) => {
    createApp(data);
    toast.success("임시저장 완료", {
      description: "미니앱이 임시저장되었습니다.",
    });
    router.push("/apps");
  };

  const handleSubmitForReview = (data: MiniAppFormValues) => {
    const app = createApp(data);
    submitForReview(app.id);
    toast.success("심사 제출 완료", {
      description: "미니앱이 심사에 제출되었습니다.",
    });
    router.push("/apps");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="animate-fade-up">
        <h1 className="heading-display text-2xl tracking-tight">새 미니앱 등록</h1>
        <p className="text-sm text-muted-foreground mt-1">
          새로운 미니앱의 정보를 입력하고 심사를 요청하세요.
        </p>
        <div className="h-0.5 w-8 bg-union mt-3" />
      </div>
      <div className="animate-fade-up delay-2">
        <AppForm
          onSaveDraft={handleSaveDraft}
          onSubmitForReview={handleSubmitForReview}
        />
      </div>
    </div>
  );
}
