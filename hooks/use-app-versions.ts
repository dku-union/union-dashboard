"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type {
  AppVersion,
  CreateVersionResponse,
  MiniAppCategoryDto,
  MiniAppRecord,
  MiniAppWithWorkspace,
  Review,
} from "@/types/app-version";

interface ApiErrorPayload {
  error?: string;
  requestId?: string;
}

function apiErrorMessage(payload: ApiErrorPayload, fallback: string) {
  const message = payload.error || fallback;
  if (!payload.requestId) return message;

  return `${message} 요청 ID: ${payload.requestId.slice(0, 8)}`;
}

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

// 미니앱 카테고리 목록 (활성만, Spring 측 permitAll)
// 한 세션 동안 한 번만 fetch — 카테고리는 거의 안 변함.
let cachedCategories: MiniAppCategoryDto[] | null = null;
let inFlight: Promise<MiniAppCategoryDto[] | null> | null = null;

export function useMiniAppCategories() {
  const [categories, setCategories] = useState<MiniAppCategoryDto[]>(
    cachedCategories ?? [],
  );
  const [isLoading, setIsLoading] = useState(!cachedCategories);

  useEffect(() => {
    if (cachedCategories) return;
    const promise =
      inFlight ??
      (inFlight = (async () => {
        try {
          const res = await fetch("/api/mini-apps/categories");
          if (!res.ok) return null;
          const data = (await res.json()) as MiniAppCategoryDto[];
          cachedCategories = data;
          return data;
        } catch {
          return null;
        } finally {
          inFlight = null;
        }
      })());

    promise.then((data) => {
      if (data) setCategories(data);
      else toast.error("카테고리 목록을 불러오지 못했습니다.");
      setIsLoading(false);
    });
  }, []);

  return { categories, isLoading };
}

// 미니앱 생성
export function useCreateMiniApp() {
  const [isCreating, setIsCreating] = useState(false);

  const createMiniApp = async (data: {
    appId: string;
    name: string;
    description?: string;
    workspaceId: string;
    categoryId: number;
    keywords?: string[];
    permissions?: string[];
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

// 테스트 세션 발급 (10분 유효 토큰형 QR 링크)
//
// 이전에 사용하던 useBundleUrl(영구 versionId 노출형)은 deprecate되어 제거됨.
// 본 훅은 union-app://test-app?token=<uuid> 형태의 1회용 링크를 반환한다.
export function useTestSession() {
  const [isLoading, setIsLoading] = useState(false);

  const createTestSession = useCallback(
    async (versionId: string): Promise<string | null> => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/app-versions/${versionId}/test-session`,
          { method: "POST" },
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(apiErrorMessage(data, "테스트 링크를 발급하지 못했습니다."));
          return null;
        }
        return data.testLink as string;
      } catch {
        toast.error("테스트 링크 발급 중 오류가 발생했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { createTestSession, isLoading };
}

// 버전 생성 → GCS 업로드 → 확인 (전체 업로드 플로우)
export function useUploadVersion() {
  const [step, setStep] = useState<"idle" | "creating" | "uploading" | "confirming" | "done" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [versionId, setVersionId] = useState<string | null>(null);
  const [didRetry, setDidRetry] = useState(false);

  const upload = async (data: {
    miniAppId: number;
    versionNumber: string;
    releaseNotes?: string;
    file: File;
  }) => {
    try {
      // Step 1: 버전 생성 + 업로드 URL 받기
      setStep("creating");
      setDidRetry(false);
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
        throw new Error(apiErrorMessage(createData, "버전 생성에 실패했습니다."));
      }
      const { versionId: vid, uploadUrl } = createData as CreateVersionResponse;
      setVersionId(vid);

      // Step 2: GCS에 직접 업로드. 실패 시 signed URL 재발급 후 1회 자동 재시도.
      setStep("uploading");
      try {
        await uploadToGCS(uploadUrl, data.file, setUploadProgress);
      } catch (firstError) {
        toast.info("업로드 실패. 잠시 후 자동 재시도합니다.");
        setDidRetry(true);
        setUploadProgress(0);
        const refreshRes = await fetch(`/api/app-versions/${vid}/upload-url-refresh`, {
          method: "POST",
        });
        const refreshData = await refreshRes.json();
        if (!refreshRes.ok) {
          // 재발급 자체가 실패하면 원래 에러 메시지 우선 노출
          throw new Error(
            apiErrorMessage(refreshData, firstError instanceof Error ? firstError.message : "업로드 URL 재발급에 실패했습니다."),
          );
        }
        const { uploadUrl: refreshedUrl } = refreshData as CreateVersionResponse;
        await uploadToGCS(refreshedUrl, data.file, setUploadProgress);
      }

      // Step 3: 업로드 확인
      setStep("confirming");
      const confirmRes = await fetch(`/api/app-versions/${vid}/confirm`, {
        method: "POST",
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(apiErrorMessage(confirmData, "업로드 확인에 실패했습니다."));
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
    setDidRetry(false);
  };

  return { upload, step, uploadProgress, versionId, didRetry, reset };
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
        toast.error(apiErrorMessage(data, "심사 요청에 실패했습니다."));
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

// 승인된 버전 배포
export function useDeployVersion() {
  const [deployingVersionId, setDeployingVersionId] = useState<string | null>(null);

  const deployVersion = async (versionId: string) => {
    setDeployingVersionId(versionId);
    try {
      const res = await fetch(`/api/app-versions/${versionId}/deploy`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(apiErrorMessage(data, "배포에 실패했습니다."));
        return null;
      }
      toast.success("미니앱이 배포되었습니다.");
      return data as AppVersion;
    } catch {
      toast.error("배포 중 오류가 발생했습니다.");
      return null;
    } finally {
      setDeployingVersionId(null);
    }
  };

  return { deployVersion, deployingVersionId };
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
  contentType: string = "application/octet-stream",
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);

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

// 미니앱 아이콘 업로드 (URL 발급 → GCS PUT → 메타 저장)
type IconUploadStep = "idle" | "url" | "uploading" | "saving" | "done" | "error";

export function useUploadMiniAppIcon() {
  const [step, setStep] = useState<IconUploadStep>("idle");
  const [progress, setProgress] = useState(0);

  const uploadIcon = useCallback(
    async (miniAppId: number, file: File): Promise<string | null> => {
      try {
        setStep("url");
        setProgress(0);
        const urlRes = await fetch(
          `/api/mini-apps/${miniAppId}/icon/upload-url`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              contentLength: file.size,
            }),
          },
        );
        const urlData = await urlRes.json();
        if (!urlRes.ok) {
          throw new Error(
            apiErrorMessage(urlData, "업로드 URL 발급에 실패했습니다."),
          );
        }
        const { uploadUrl, iconUrl } = urlData as {
          uploadUrl: string;
          iconUrl: string;
        };

        setStep("uploading");
        await uploadToGCS(uploadUrl, file, setProgress, file.type);

        setStep("saving");
        const saveRes = await fetch(`/api/mini-apps/${miniAppId}/icon`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iconUrl }),
        });
        const saveData = await saveRes.json();
        if (!saveRes.ok) {
          throw new Error(
            apiErrorMessage(saveData, "아이콘 저장에 실패했습니다."),
          );
        }

        setStep("done");
        return (saveData as { iconUrl: string }).iconUrl;
      } catch (err) {
        setStep("error");
        const message =
          err instanceof Error
            ? err.message
            : "아이콘 업로드 중 오류가 발생했습니다.";
        toast.error(message);
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStep("idle");
    setProgress(0);
  }, []);

  return { uploadIcon, step, progress, reset };
}
