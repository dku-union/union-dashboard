"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";
import { NotificationBell } from "./notification-bell";
import { usePathname } from "next/navigation";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "대시보드",
  "/apps": "미니앱 관리",
  "/apps/new": "새 미니앱 등록",
  "/reviews": "심사 현황",
  "/analytics": "분석",
  "/docs": "개발 문서",
  "/docs/design-guidelines": "디자인 가이드라인",
  "/docs/development-guide": "개발 가이드",
  "/docs/bridge-api": "Bridge API",
  "/workspace": "워크스페이스",
  "/workspace/new": "새 워크스페이스",
  "/settings": "설정",
};

// UUID 패턴
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function DashboardHeader() {
  const pathname = usePathname();
  const [workspaceNames, setWorkspaceNames] = useState<Record<string, string>>({});

  // /workspace/[id] 경로에서 워크스페이스 이름 fetch
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "workspace" && segments[1] && UUID_REGEX.test(segments[1])) {
      const wsId = segments[1];
      if (!workspaceNames[wsId]) {
        fetch(`/api/workspaces/${wsId}`)
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            if (data?.name) {
              setWorkspaceNames((prev) => ({ ...prev, [wsId]: data.name }));
            }
          })
          .catch(() => {});
      }
    }
  }, [pathname, workspaceNames]);

  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") {
      return [{ label: "대시보드", href: "/dashboard" }];
    }

    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      let label = breadcrumbMap[currentPath];
      if (!label && UUID_REGEX.test(segment)) {
        label = workspaceNames[segment] ?? "...";
      }
      crumbs.push({ label: label || segment, href: currentPath });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 bg-card sticky top-0 z-30">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-border/60" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {crumbs.map((crumb, index) => (
            <span key={crumb.href} className="contents">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === crumbs.length - 1 ? (
                  <BreadcrumbPage className="text-[13px] font-medium">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href} className="text-[13px]">
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
