"use client";

import { useState, useEffect } from "react";
import { MiniApp, MiniAppStatus } from "@/types/mini-app";
import { mockMiniApps } from "@/data/mini-apps";
import { MiniAppFormValues } from "@/lib/validations";

export function useMiniApps() {
  const [apps, setApps] = useState<MiniApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setApps(mockMiniApps);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getApp = (id: string) => apps.find((a) => a.id === id);

  const createApp = (data: MiniAppFormValues): MiniApp => {
    const newApp: MiniApp = {
      id: `app-${Date.now()}`,
      publisherId: "pub-001",
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category as MiniApp["category"],
      keywords: data.keywords,
      permissions: data.permissions as MiniApp["permissions"],
      iconUrl: "",
      screenshotUrls: [],
      status: "draft",
      currentVersion: data.version || "1.0.0",
      versions: [
        {
          id: `ver-${Date.now()}`,
          appId: `app-${Date.now()}`,
          version: data.version || "1.0.0",
          status: "draft",
          releaseNote: data.releaseNote || "최초 버전",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApps((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApp = (id: string, data: Partial<MiniApp>) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, ...data, updatedAt: new Date().toISOString() } : app
      )
    );
  };

  const submitForReview = (id: string) => {
    updateApp(id, { status: "in_review" as MiniAppStatus });
  };

  const deleteApp = (id: string) => {
    setApps((prev) => prev.filter((app) => app.id !== id));
  };

  return {
    apps,
    isLoading,
    getApp,
    createApp,
    updateApp,
    submitForReview,
    deleteApp,
  };
}
