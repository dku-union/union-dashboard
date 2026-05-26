"use client";

import { useEffect, useState } from "react";
import { APP_ID_REGEX } from "@/lib/validations";

export type AppIdStatus =
  | "idle"
  | "invalid"
  | "checking"
  | "available"
  | "taken"
  | "error";

interface UseAppIdAvailabilityResult {
  status: AppIdStatus;
  message: string;
}

const DEBOUNCE_MS = 400;

// 입력된 appId 의 형식 검증 + Spring 중복 조회를 디바운스해서 수행.
// 빈 입력은 idle 로 유지하고, 형식 실패 시 즉시 invalid 로 차단해 네트워크 절약.
export function useAppIdAvailability(appId: string): UseAppIdAvailabilityResult {
  const [status, setStatus] = useState<AppIdStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const trimmed = appId.trim();

    if (!trimmed) {
      setStatus("idle");
      setMessage("");
      return;
    }

    if (!APP_ID_REGEX.test(trimmed)) {
      setStatus("invalid");
      setMessage("reverse-domain 형식이어야 합니다. (예: com.union.sample-app)");
      return;
    }

    setStatus("checking");
    setMessage("사용 가능 여부 확인 중...");

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/mini-apps/check-app-id?appId=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          setStatus("error");
          setMessage(body?.error ?? "중복 확인에 실패했습니다.");
          return;
        }
        if (body?.available) {
          setStatus("available");
          setMessage("사용 가능한 appId 입니다.");
        } else {
          setStatus("taken");
          setMessage("이미 사용 중인 appId 입니다.");
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setStatus("error");
        setMessage("중복 확인에 실패했습니다.");
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [appId]);

  return { status, message };
}
