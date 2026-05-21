"use client";

import { useState, useEffect, useCallback } from "react";
import { Workspace } from "@/types/workspace";
import { toast } from "sonner";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<(Workspace & { myRole: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    try {
      const res = await fetch("/api/workspaces");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWorkspaces(data);
    } catch {
      toast.error("워크스페이스 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return { workspaces, isLoading, refetch: fetchWorkspaces };
}

export function useWorkspace(id: string) {
  const [workspace, setWorkspace] = useState<(Workspace & { myRole: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspace = useCallback(async () => {
    try {
      const res = await fetch(`/api/workspaces/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWorkspace(data);
    } catch {
      toast.error("워크스페이스 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  return { workspace, isLoading, refetch: fetchWorkspace };
}

export function useCreateWorkspace() {
  const [isCreating, setIsCreating] = useState(false);

  const createWorkspace = async (data: {
    name: string;
    description?: string;
    contactEmail: string;
    color?: string;
  }) => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "워크스페이스 생성에 실패했습니다.");
        return null;
      }

      toast.success("워크스페이스가 생성되었습니다.");
      return result;
    } catch {
      toast.error("워크스페이스 생성 중 오류가 발생했습니다.");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createWorkspace, isCreating };
}
