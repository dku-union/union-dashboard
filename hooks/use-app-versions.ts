"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type {
  AppVersion,
  CreateVersionResponse,
  MiniAppRecord,
  MiniAppWithWorkspace,
  Review,
} from "@/types/app-version";

// 내 전체 미니앱 조회 (모든 워크스페이스)
export function useMyMiniApps() {
  const [apps, setApps] = useState<MiniAppWithWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch("/api/mini-apps/my-apps");
      if (!res.ok) throw new Error();
      setApps(await res.json());
    } catch {
      toast.error("미니앱 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return { apps, isLoading, refetch: fetchApps };
}

// 단일 미니앱 상세 조회
export function useMiniAppDetail(id: number | null) {
  const [app, setApp] = useState<MiniAppWithWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApp = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/mini-apps/${id}`);
      if (!res.ok) throw new Error();
      setApp(await res.json());
    } catch {
      toast.error("앱 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApp();
  }, [fetchApp]);

  return { app, isLoading, refetch: fetchApp };
}

// 워크스페이스의 미니앱 목록
export function useMiniAppList(workspaceId: string) {
  const [apps, setApps] = useState<MiniAppRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch(`/api/mini-apps?workspaceId=${workspaceId}`);
      if (!res.ok) throw new Error();
      setApps(await res.json());
    } catch {
      toast.error("미니앱 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return { apps, isLoading, refetch: fetchApps };
}

// 미니앱 생성
export function useCreateMiniApp() {
  const [isCreating, setIsCreating] = useState(false);

  const createMiniApp = async (data: {
    name: string;
    description?: string;
    workspaceId: string;
  }) => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/mini-apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "미니앱 등록에 실패했습니다.");
        return null;
      }
      toast.success("미니앱이 등록되었습니다.");
      return result as MiniAppRecord;
    } catch {
      toast.error("미니앱 등록 중 오류가 발생했습니다.");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createMiniApp, isCreating };
}

// 미니앱별 버전 목록 (UPLOADED 상태가 있으면 polling)
export function useAppVersions(miniAppId: number | null, pollInterval = 0) {
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVersions = useCallback(async () => {
    if (!miniAppId) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/app-versions?miniAppId=${miniAppId}`);
      if (!res.ok) throw new Error();
      setVersions(await res.json());
    } catch {
      toast.error("버전 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [miniAppId]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  // UPLOADED && testedAt 없는 버전이 있으면 polling
  useEffect(() => {
    if (pollInterval <= 0) return;
    const hasUntested = versions.some(
      (v) => v.status === "UPLOADED" && !v.testedAt,
    );
    if (!hasUntested) return;

    const timer = setInterval(fetchVersions, pollInterval);
    return () => clearInterval(timer);
  }, [versions, pollInterval, fetchVersions]);

  return { versions, isLoading, refetch: fetchVersions };
}

// 번들 URL 조회 (테스트 QR용)
export function useBundleUrl() {
  const [isLoading, setIsLoading] = useState(false);

  const getBundleUrl = useCallback(async (versionId: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/app-versions/${versionId}/bundle`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "번들 URL을 가져오지 못했습니다.");
        return null;
      }
      return data.downloadUrl;
    } catch {
      toast.error("번들 URL 조회 중 오류가 발생했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getBundleUrl, isLoading };
}

// 버전 생성 → GCS 업로드 → 확인 (전체 업로드 플로우)
export function useUploadVersion() {
  const [step, setStep] = useState<"idle" | "creating" | "uploading" | "confirming" | "done" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [versionId, setVersionId] = useState<string | null>(null);

  const upload = async (data: {
    miniAppId: number;
    versionNumber: string;
    releaseNotes?: string;
    file: File;
  }) => {
    try {
      // Step 1: 버전 생성 + 업로드 URL 받기
      setStep("creating");
      const createRes = await fetch("/api/app-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          miniAppId: data.miniAppId,
          versionNumber: data.versionNumber,
          releaseNotes: data.releaseNotes,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || "버전 생성에 실패했습니다.");
      }
      const { versionId: vid, uploadUrl } = createData as CreateVersionResponse;
      setVersionId(vid);

      // Step 2: GCS에 직접 업로드
      setStep("uploading");
      await uploadToGCS(uploadUrl, data.file, setUploadProgress);

      // Step 3: 업로드 확인
      setStep("confirming");
      const confirmRes = await fetch(`/api/app-versions/${vid}/confirm`, {
        method: "POST",
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(confirmData.error || "업로드 확인에 실패했습니다.");
      }

      setStep("done");
      toast.success("업로드가 완료되었습니다.");
      return confirmData as AppVersion;
    } catch (err) {
      setStep("error");
      const message = err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.";
      toast.error(message);
      return null;
    }
  };

  const reset = () => {
    setStep("idle");
    setUploadProgress(0);
    setVersionId(null);
  };

  return { upload, step, uploadProgress, versionId, reset };
}

// 심사 요청 제출
export function useSubmitReview() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async (versionId: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "심사 요청에 실패했습니다.");
        return null;
      }
      toast.success("심사가 요청되었습니다.");
      return data as Review;
    } catch {
      toast.error("심사 요청 중 오류가 발생했습니다.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitReview, isSubmitting };
}

// 내 심사 목록 조회
export function useMyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews/mine");
      if (!res.ok) throw new Error();
      setReviews(await res.json());
    } catch {
      toast.error("심사 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, isLoading, refetch: fetchReviews };
}

// GCS Signed URL로 직접 PUT 업로드 (XMLHttpRequest for progress)
function uploadToGCS(
  uploadUrl: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error("GCS 업로드에 실패했습니다. 다시 시도해주세요."));
      }
    };

    xhr.onerror = () => reject(new Error("네트워크 오류가 발생했습니다."));
    xhr.send(file);
  });
}
