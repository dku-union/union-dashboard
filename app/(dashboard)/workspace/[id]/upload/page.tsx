"use client";

import { useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useMiniAppList, useCreateMiniApp, useUploadVersion } from "@/hooks/use-app-versions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  FileArchive,
  X,
  CheckCircle,
  Loader2,
  Plus,
  Package,
  AppWindow,
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import type { AppVersion } from "@/types/app-version";

type FlowStep = "select-app" | "version-info" | "uploading" | "done";

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = params.id as string;
  const preselectedMiniAppId = searchParams.get("miniAppId");
  const rejectedVersion = searchParams.get("rejectedVersion");

  const { workspace, isLoading: wsLoading } = useWorkspace(workspaceId);
  const { apps, isLoading: appsLoading, refetch: refetchApps } = useMiniAppList(workspaceId);
  const { createMiniApp, isCreating } = useCreateMiniApp();
  const { upload, step: uploadStep, uploadProgress, reset: resetUpload } = useUploadVersion();

  const [flowStep, setFlowStep] = useState<FlowStep>(preselectedMiniAppId ? "version-info" : "select-app");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(preselectedMiniAppId);
  const [isNewApp, setIsNewApp] = useState(false);

  // 새 미니앱 필드
  const [newAppName, setNewAppName] = useState("");
  const [newAppDescription, setNewAppDescription] = useState("");

  // 버전 필드
  const [versionNumber, setVersionNumber] = useState(
    rejectedVersion ? incrementPatchVersion(rejectedVersion) : "1.0.0",
  );
  const [releaseNotes, setReleaseNotes] = useState("");
  const [buildFile, setBuildFile] = useState<File | null>(null);
  const [uploadedVersion, setUploadedVersion] = useState<AppVersion | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedApp = apps.find((item) => String(item.id) === selectedAppId) ?? null;
  const currentFlowStep = flowStep === "version-info" && !selectedApp ? "select-app" : flowStep;
  const canUpload = !!buildFile && !!versionNumber && /^\d+\.\d+\.\d+$/.test(versionNumber);
  const myRole = workspace?.myRole;
  const canUploadInWorkspace = myRole === "owner" || myRole === "admin" || myRole === "developer";

  const handleSelectExistingApp = (appId: string | null) => {
    if (!appId) return;
    const app = apps.find((a) => a.id === Number(appId));
    if (app) {
      setSelectedAppId(String(app.id));
      setIsNewApp(false);
    }
  };

  const handleCreateNewApp = async () => {
    if (!newAppName.trim()) return;
    const app = await createMiniApp({
      name: newAppName,
      description: newAppDescription || undefined,
      workspaceId,
    });
    if (app) {
      setSelectedAppId(String(app.id));
      setIsNewApp(false);
      await refetchApps();
      setFlowStep("version-info");
    }
  };

  const handleNextToVersion = () => {
    if (selectedApp) {
      setFlowStep("version-info");
    }
  };

  const handleUpload = async () => {
    if (!selectedApp || !buildFile || !versionNumber) return;

    setFlowStep("uploading");
    const result = await upload({
      miniAppId: selectedApp.id,
      versionNumber,
      releaseNotes: releaseNotes || undefined,
      file: buildFile,
    });

    if (result) {
      setUploadedVersion(result);
      setFlowStep("done");
    } else {
      setFlowStep("version-info");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".unionapp")) {
        toast.error(".unionapp 형식의 빌드 파일만 업로드할 수 있습니다.");
        e.target.value = "";
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("빌드 파일은 최대 50MB까지 업로드할 수 있습니다.");
        e.target.value = "";
        return;
      }
      setBuildFile(file);
    }
  };

  if (wsLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-muted-foreground">워크스페이스를 찾을 수 없습니다.</p>
        <Button variant="outline" onClick={() => router.push("/workspace")}>
          워크스페이스로 돌아가기
        </Button>
      </div>
    );
  }

  if (!canUploadInWorkspace) {
    return (
      <div className="publisher-page">
        <div className="publisher-page-header animate-fade-up">
          <div className="flex min-w-0 items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="mt-1 h-8 w-8 shrink-0"
              onClick={() => router.push(`/workspace/${workspaceId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <p className="publisher-eyebrow">Permission Required</p>
              <h1 className="mt-1 text-heading-1">업로드 권한이 없습니다</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                미니앱 등록과 버전 업로드는 소유자, 관리자, 개발자 권한에서만 가능합니다.
              </p>
            </div>
          </div>
        </div>
        <Card className="publisher-panel">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <ShieldCheck className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">현재 역할: {myRole ?? "알 수 없음"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                업로드가 필요하면 워크스페이스 관리자에게 권한 변경을 요청하세요.
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push(`/workspace/${workspaceId}`)}>
              워크스페이스로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="publisher-page">
      <div className="publisher-page-header animate-fade-up">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 h-8 w-8 shrink-0"
            onClick={() => router.push(`/workspace/${workspaceId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <p className="publisher-eyebrow">Release Preparation</p>
            <h1 className="mt-1 text-heading-1">미니앱 업로드</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              앱 등록, 버전 정보, 빌드 업로드를 순서대로 완료한 뒤 테스트와 심사 요청으로 이어갑니다.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-card/80 px-2.5 py-1 text-xs text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              {workspace?.name}
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <StepRail currentStep={currentFlowStep} />

          {currentFlowStep === "select-app" && (
            <div className="space-y-4 animate-fade-up delay-1">
              <Card className="publisher-panel">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">미니앱 선택</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                기존 앱에 새 버전을 올리거나, 출시 준비를 위해 새 앱을 먼저 등록하세요.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {apps.length > 0 && !isNewApp && (
                <>
                  <Select onValueChange={handleSelectExistingApp}>
                    <SelectTrigger className="border-border/60">
                      <SelectValue placeholder="미니앱을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {apps.map((app) => (
                        <SelectItem key={app.id} value={String(app.id)}>
                          {app.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/40" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">또는</span>
                    </div>
                  </div>
                </>
              )}

              {!isNewApp ? (
                <Button
                  variant="outline"
                  className="h-11 w-full border-dashed border-border/70"
                  onClick={() => setIsNewApp(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  새 미니앱 등록
                </Button>
              ) : (
                <div className="space-y-4 rounded-lg border border-border/70 bg-muted/20 p-4">
                  <div>
                    <Label className="publisher-eyebrow">앱 이름</Label>
                    <Input
                      placeholder="미니앱 이름"
                      className="mt-1.5 border-border/60 bg-card"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="publisher-eyebrow">설명 (선택)</Label>
                    <Textarea
                      placeholder="미니앱에 대한 간단한 설명"
                      className="mt-1.5 min-h-[96px] border-border/60 bg-card"
                      value={newAppDescription}
                      onChange={(e) => setNewAppDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-border/60"
                      onClick={() => setIsNewApp(false)}
                    >
                      취소
                    </Button>
                    <Button
                      className="bg-union text-white hover:bg-union/90"
                      disabled={!newAppName.trim() || isCreating}
                      onClick={handleCreateNewApp}
                    >
                      {isCreating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      등록
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
              </Card>

              {selectedApp && !isNewApp && (
                <div className="flex justify-end">
                  <Button
                    className="bg-union text-white hover:bg-union/90"
                    onClick={handleNextToVersion}
                  >
                    다음
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentFlowStep === "version-info" && selectedApp && (
            <div className="space-y-4 animate-fade-up delay-1">
              {rejectedVersion && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  반려된 v{rejectedVersion}을(를) 수정한 새 버전을 업로드합니다.
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="font-medium text-foreground">{selectedApp.name}</span>
                에 새 버전 업로드
              </div>

          <Card className="publisher-panel">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">버전 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="publisher-eyebrow">버전</Label>
                <Input
                  placeholder="1.0.0"
                  className="mt-1.5 border-border/60 bg-card font-mono"
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground/60 mt-1">
                  Semantic Versioning (x.y.z)
                </p>
              </div>

              <div>
                <Label className="publisher-eyebrow">릴리즈 노트 (선택)</Label>
                <Textarea
                  placeholder="이번 버전에서 변경된 내용을 작성해주세요"
                  className="mt-1.5 min-h-[112px] border-border/60 bg-card"
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                />
              </div>

              <div>
                <Label className="publisher-eyebrow">빌드 파일</Label>
                <p className="text-[11px] text-muted-foreground/60 mb-3 mt-1">
                  .unionapp 형식의 빌드 파일을 업로드해주세요
                </p>
                {buildFile ? (
                  <div className="flex items-center gap-3 rounded-lg border border-sage/20 bg-sage/5 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10">
                      <FileArchive className="h-5 w-5 text-sage" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium truncate">{buildFile.name}</p>
                        <CheckCircle className="h-3.5 w-3.5 text-sage shrink-0" />
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {(buildFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-union"
                      onClick={() => {
                        setBuildFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/20 p-8 transition-colors hover:border-union/30 hover:bg-union/5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card mb-3">
                      <Upload className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      클릭하여 빌드 파일 업로드
                    </span>
                    <span className="text-[11px] text-muted-foreground/60 mt-1 font-mono">
                      .unionapp (최대 50MB)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".unionapp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="border-border/60"
              onClick={() => {
                setFlowStep("select-app");
                setSelectedAppId(null);
                resetUpload();
                router.replace(`/workspace/${workspaceId}/upload`);
              }}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              이전
            </Button>
            <Button
              className="bg-union text-white hover:bg-union/90"
              disabled={!canUpload}
              onClick={handleUpload}
            >
              <Upload className="mr-2 h-4 w-4" />
              업로드
            </Button>
          </div>
            </div>
          )}

          {currentFlowStep === "uploading" && (
        <Card className="publisher-panel animate-fade-up">
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-union/10">
              <Loader2 className="h-8 w-8 text-union animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">
                {uploadStep === "creating" && "버전 생성 중..."}
                {uploadStep === "uploading" && "파일 업로드 중..."}
                {uploadStep === "confirming" && "업로드 확인 중..."}
              </p>
              {uploadStep === "uploading" && (
                <div className="mt-4 w-64">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 font-mono">{uploadProgress}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
          )}

          {currentFlowStep === "done" && (
        <Card className="publisher-panel animate-fade-up">
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-sage/10">
              <CheckCircle className="h-8 w-8 text-sage" />
            </div>
            <div className="text-center">
              <p className="heading-display text-lg">업로드 완료</p>
              <p className="text-sm text-muted-foreground mt-1">
                미니앱 빌드가 성공적으로 업로드되었습니다.
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                className="border-border/60"
                onClick={() => {
                  resetUpload();
                  setBuildFile(null);
                  setUploadedVersion(null);
                  setVersionNumber("1.0.0");
                  setReleaseNotes("");
                  setFlowStep("version-info");
                }}
              >
                다른 버전 업로드
              </Button>
              <Button
                className="bg-union text-white hover:bg-union/90"
                onClick={() => {
                  if (uploadedVersion?.miniAppId) {
                    router.push(`/apps/${uploadedVersion.miniAppId}/versions`);
                    return;
                  }
                  router.push(`/workspace/${workspaceId}`);
                }}
              >
                테스트·심사로 이동
              </Button>
            </div>
          </CardContent>
        </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="publisher-panel animate-fade-up delay-2">
            <CardContent className="p-4">
              <p className="publisher-eyebrow">Selected App</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/50">
                  <AppWindow className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{selectedApp?.name ?? "앱 선택 전"}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {selectedApp?.description || "업로드할 미니앱을 선택하거나 새로 등록하세요."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="publisher-panel animate-fade-up delay-3">
            <CardContent className="p-4">
              <p className="publisher-eyebrow">Review Readiness</p>
              <div className="mt-4 space-y-3">
                <ChecklistItem
                  done={!!selectedApp}
                  icon={AppWindow}
                  title="앱 등록"
                  description="심사 대상 미니앱이 선택되어야 합니다."
                />
                <ChecklistItem
                  done={/^\d+\.\d+\.\d+$/.test(versionNumber)}
                  icon={FileCheck2}
                  title="버전 형식"
                  description="x.y.z 형식의 버전 번호를 사용합니다."
                />
                <ChecklistItem
                  done={!!buildFile}
                  icon={FileArchive}
                  title="빌드 파일"
                  description=".unionapp 파일을 50MB 이하로 업로드합니다."
                />
                <ChecklistItem
                  done={currentFlowStep === "done"}
                  icon={ClipboardCheck}
                  title="다음 단계"
                  description="업로드 완료 후 테스트와 심사 요청을 진행합니다."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="publisher-panel animate-fade-up delay-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage/10">
                  <ShieldCheck className="h-4 w-4 text-sage" />
                </div>
                <div>
                  <p className="text-sm font-semibold">출시 준비 기준</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    앱 이름은 직관적으로, 릴리즈 노트는 변경 사항 중심으로 작성하면 심사 대응이 쉬워집니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function incrementPatchVersion(version: string) {
  const parts = version.split(".").map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return "1.0.0";
  }
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function StepRail({ currentStep }: { currentStep: FlowStep }) {
  const steps = [
    { id: "select-app", label: "앱 선택", icon: AppWindow },
    { id: "version-info", label: "버전 정보", icon: FileCheck2 },
    { id: "uploading", label: "업로드", icon: Upload },
    { id: "done", label: "완료", icon: CheckCircle },
  ] satisfies { id: FlowStep; label: string; icon: typeof AppWindow }[];
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="publisher-panel rounded-lg p-3">
      <div className="grid gap-2 sm:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = index === currentIndex;
          const done = index < currentIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs ${
                active
                  ? "bg-union/10 text-union"
                  : done
                    ? "bg-sage/10 text-sage"
                    : "bg-muted/25 text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChecklistItem({
  done,
  icon: Icon,
  title,
  description,
}: {
  done: boolean;
  icon: typeof AppWindow;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${done ? "bg-sage/10" : "bg-muted/40"}`}>
        {done ? (
          <CheckCircle className="h-3.5 w-3.5 text-sage" />
        ) : (
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
