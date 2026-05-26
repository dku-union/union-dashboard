"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  AppWindow,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  Settings,
  Users,
  KeyRound,
  Bell,
  History,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { title: "미니앱 관리", href: "/apps", icon: AppWindow },
  { title: "심사 현황", href: "/reviews", icon: ClipboardCheck },
  { title: "분석", href: "/analytics", icon: BarChart3 },
];

const teamItems = [
  { title: "워크스페이스", href: "/workspace", icon: Users },
];

const resourceItems = [
  { title: "개발 문서", href: "/docs", icon: BookOpen },
];

const bottomItems = [
  { title: "설정", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    // 앱 컨텍스트 항목 (/apps/{id}, /apps/{id}/...): 정확 일치만 활성화 — 형제 경로끼리 충돌 방지.
    if (/^\/apps\/\d+/.test(href)) return pathname === href;
    return pathname.startsWith(href);
  };

  /**
   * /apps/{숫자 id}/* 경로일 때 그 id 를 추출. 사이드바에서 앱 전용 보조 메뉴를 노출하는 데 사용.
   * /apps, /apps/new 같은 비-상세 경로에선 null.
   */
  const currentAppId = (() => {
    const match = pathname.match(/^\/apps\/(\d+)(?:\/.*)?$/);
    return match ? match[1] : null;
  })();

  const appContextItems = currentAppId
    ? [
        {
          title: "앱 상세",
          href: `/apps/${currentAppId}`,
          icon: AppWindow,
        },
        {
          title: "버전 이력",
          href: `/apps/${currentAppId}/versions`,
          icon: History,
        },
        {
          title: "API 키",
          href: `/apps/${currentAppId}/api-keys`,
          icon: KeyRound,
        },
        {
          title: "알림 발송",
          href: `/apps/${currentAppId}/notifications`,
          icon: Bell,
        },
      ]
    : [];

  const renderMenu = (items: typeof navItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            render={<Link href={item.href} />}
            isActive={isActive(item.href)}
            className="group relative h-9 rounded-lg px-2 transition-colors duration-100 data-[active=true]:bg-sidebar-accent"
          >
            <item.icon
              className={`h-[15px] w-[15px] shrink-0 transition-colors ${
                isActive(item.href)
                  ? "text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
              }`}
            />
            <span
              className={`text-[13px] leading-none ${
                isActive(item.href)
                  ? "font-medium text-sidebar-accent-foreground"
                  : "font-normal text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
              }`}
            >
              {item.title}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className="border-r border-sidebar-border/80">
      <SidebarHeader className="h-16 px-4 flex items-center border-b border-sidebar-border/80 bg-sidebar" style={{ flexDirection: "row" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg border border-sidebar-border bg-background/70">
            <Image src="/logo.svg" alt="Union" width={22} height={22} className="shrink-0" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-sidebar-accent-foreground leading-none">
              Union Console
            </p>
            <p className="text-[10px] text-sidebar-foreground/60 tracking-[0.08em] uppercase mt-1">
              Publisher Center
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 pt-3">
        <SidebarGroup className="px-2 py-1">
          <SidebarGroupContent>
            {renderMenu(navItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {appContextItems.length > 0 && (
          <SidebarGroup className="px-2 py-1 mt-2">
            <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-[0.1em] text-sidebar-foreground/50 px-2 mb-0.5 h-auto">
              현재 앱
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenu(appContextItems)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="px-2 py-1 mt-2">
          <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-[0.1em] text-sidebar-foreground/50 px-2 mb-0.5 h-auto">
            팀
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenu(teamItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-2 py-1 mt-2">
          <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-[0.1em] text-sidebar-foreground/50 px-2 mb-0.5 h-auto">
            리소스
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenu(resourceItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarSeparator className="mx-0 mb-1" />
        {renderMenu(bottomItems)}
        <div className="mx-2 mt-3 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/35 px-3 py-2">
          <p className="text-[11px] font-medium text-sidebar-accent-foreground">배포 준비</p>
          <p className="mt-1 text-[10px] leading-4 text-sidebar-foreground/65">
            테스트 완료 후 심사를 요청하고 승인된 버전을 배포하세요.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
