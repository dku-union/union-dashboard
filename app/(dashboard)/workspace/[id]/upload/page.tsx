"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import type { MiniAppRecord } from "@/types/app-version";

type FlowStep = "select-app" | "version-info" | "uploading" | "done";

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const { workspace, isLoading: wsLoading } = useWorkspace(workspaceId);
  const { apps, isLoading: appsLoading, refetch: refetchApps } = useMiniAppList(workspaceId);
  const { createMiniApp, isCreating } = useCreateMiniApp();
  const { upload, step: uploadStep, uploadProgress, reset: resetUpload } = useUploadVersion();

  const [flowStep, setFlowStep] = useState<FlowStep>("select-app");
  const [selectedApp, setSelectedApp] = useState<MiniAppRecord | null>(null);
  const [isNewApp, setIsNewApp] = useState(false);

  // 새 미니앱 필드
  const [newAppName, setNewAppName] = useState("");
  const [newAppDescription, setNewAppDescription] = useState("");

  // 버전 필드
  const [versionNumber, setVersionNumber] = useState("1.0.0");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [buildFile, setBuildFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectExistingApp = (appId: string | null) => {
    if (!appId) return;
    const app = apps.find((a) => a.id === Number(appId));
    if (app) {
      setSelectedApp(app);
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
      setSelectedApp(app);
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
      setFlowStep("done");
    } else {
      setFlowStep("version-info");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-up">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="heading-display text-2xl tracking-tight">미니앱 업로드</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {workspace?.name}
          </p>
          <div className="h-0.5 w-8 bg-union mt-3" />
        </div>
      </div>

      {/* Step 1: 미니앱 선택 / 생성 */}
      {flowStep === "select-app" && (
        <div className="space-y-4 animate-fade-up delay-1">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="heading-display text-lg">미니앱 선택</CardTitle>
              <p className="text-sm text-muted-foreground">
                기존 미니앱에 새 버전을 업로드하거나, 새 미니앱을 등록하세요.
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
                  className="w-full border-dashed border-border/60"
                  onClick={() => setIsNewApp(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  새 미니앱 등록
                </Button>
              ) : (
                <div className="space-y-3 rounded-lg border border-border/60 p-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">앱 이름</Label>
                    <Input
                      placeholder="미니앱 이름"
                      className="mt-1.5 border-border/60"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">설명 (선택)</Label>
                    <Textarea
                      placeholder="미니앱에 대한 간단한 설명"
                      className="mt-1.5 border-border/60 min-h-[80px]"
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

      {/* Step 2: 버전 정보 + 파일 선택 */}
      {flowStep === "version-info" && selectedApp && (
        <div className="space-y-4 animate-fade-up delay-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span className="font-medium text-foreground">{selectedApp.name}</span>
            에 새 버전 업로드
          </div>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="heading-display text-lg">버전 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">버전</Label>
                <Input
                  placeholder="1.0.0"
                  className="mt-1.5 border-border/60 font-mono"
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground/60 mt-1">
                  Semantic Versioning (x.y.z)
                </p>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">릴리즈 노트 (선택)</Label>
                <Textarea
                  placeholder="이번 버전에서 변경된 내용을 작성해주세요"
                  className="mt-1.5 min-h-[100px] border-border/60"
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">빌드 파일</Label>
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
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 p-8 hover:border-union/30 hover:bg-union/5 transition-colors">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 mb-3">
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
                resetUpload();
              }}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              이전
            </Button>
            <Button
              className="bg-union text-white hover:bg-union/90"
              disabled={!buildFile || !versionNumber || !/^\d+\.\d+\.\d+$/.test(versionNumber)}
              onClick={handleUpload}
            >
              <Upload className="mr-2 h-4 w-4" />
              업로드
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: 업로드 중 */}
      {flowStep === "uploading" && (
        <Card className="border-border/60 animate-fade-up">
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-union/10">
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

      {/* Step 4: 완료 */}
      {flowStep === "done" && (
        <Card className="border-border/60 animate-fade-up">
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage/10">
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
                  setVersionNumber("1.0.0");
                  setReleaseNotes("");
                  setFlowStep("version-info");
                }}
              >
                다른 버전 업로드
              </Button>
              <Button
                className="bg-union text-white hover:bg-union/90"
                onClick={() => router.push(`/workspace/${workspaceId}`)}
              >
                워크스페이스로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
