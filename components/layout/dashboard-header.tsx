"use client";

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

export function DashboardHeader() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") {
      return [{ label: "대시보드", href: "/dashboard" }];
    }

    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = breadcrumbMap[currentPath];
      crumbs.push({ label: label || segment, href: currentPath });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
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
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
