"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { miniAppSchema, MiniAppFormValues } from "@/lib/validations";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppFormBasicInfo } from "./app-form-basic-info";
import { AppFormPermissions } from "./app-form-permissions";
import { AppFormMedia } from "./app-form-media";
import { AppFormBuild } from "./app-form-build";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";

const steps = [
  { title: "기본 정보", description: "앱 이름, 소개, 카테고리" },
  { title: "권한 설정", description: "필요한 권한 선택" },
  { title: "미디어", description: "아이콘 및 스크린샷" },
  { title: "빌드 & 제출", description: "빌드 파일 업로드" },
];

interface AppFormProps {
  onSaveDraft: (data: MiniAppFormValues) => void;
  onSubmitForReview: (data: MiniAppFormValues) => void;
}

export function AppForm({ onSaveDraft, onSubmitForReview }: AppFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<MiniAppFormValues>({
    resolver: zodResolver(miniAppSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      category: "",
      keywords: [],
      permissions: [],
      version: "1.0.0",
      releaseNote: "",
    },
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = async () => {
    let fieldsToValidate: (keyof MiniAppFormValues)[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ["name", "shortDescription", "description", "category", "keywords"];
    }
    if (fieldsToValidate.length > 0) {
      const valid = await form.trigger(fieldsToValidate);
      if (!valid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="space-y-3">
        <div className="flex justify-between">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={`text-center transition-colors ${
                i === currentStep
                  ? "text-union font-semibold"
                  : i < currentStep
                    ? "text-muted-foreground cursor-pointer hover:text-union"
                    : "text-muted-foreground/30"
              }`}
            >
              <span className="heading-display text-xs uppercase tracking-wider hidden sm:inline">{step.title}</span>
              <span className="sm:hidden heading-display text-xs">{i + 1}</span>
            </button>
          ))}
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <Card className="border-border/60 animate-scale-in">
        <CardHeader>
          <CardTitle className="heading-display text-lg">{steps[currentStep].title}</CardTitle>
          <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              {currentStep === 0 && <AppFormBasicInfo form={form} />}
              {currentStep === 1 && <AppFormPermissions form={form} />}
              {currentStep === 2 && <AppFormMedia />}
              {currentStep === 3 && <AppFormBuild form={form} />}
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="border-border/60">
          <ChevronLeft className="mr-1 h-4 w-4" />
          이전
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={form.handleSubmit(onSaveDraft)} className="border-border/60">
            <Save className="mr-1 h-4 w-4" />
            임시저장
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep} className="bg-union text-white hover:bg-union/90">
              다음
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={form.handleSubmit(onSubmitForReview)} className="bg-union text-white hover:bg-union/90">
              <Send className="mr-1 h-4 w-4" />
              심사 제출
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
