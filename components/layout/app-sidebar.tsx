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
    return pathname.startsWith(href);
  };

  const renderMenu = (items: typeof navItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            render={<Link href={item.href} />}
            isActive={isActive(item.href)}
            className="group relative h-8 transition-colors duration-100"
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
    <Sidebar>
      {/* Header — h-14 to align with DashboardHeader */}
      <SidebarHeader className="h-14 px-4 flex items-center border-b border-sidebar-border" style={{ flexDirection: "row" }}>
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Union" width={26} height={26} className="shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-sidebar-accent-foreground leading-none tracking-tight">
              Union
            </p>
            <p className="text-[10px] text-sidebar-foreground/60 tracking-[0.1em] uppercase mt-[3px]">
              Publisher
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="pt-2 gap-0">
        <SidebarGroup className="px-2 py-1">
          <SidebarGroupContent>
            {renderMenu(navItems)}
          </SidebarGroupContent>
        </SidebarGroup>

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

      {/* Footer */}
      <SidebarFooter className="px-2 pb-4">
        <SidebarSeparator className="mx-0 mb-1" />
        {renderMenu(bottomItems)}
        <div className="px-2 pt-3">
          <span className="text-[10px] text-sidebar-foreground/40 tabular-nums">
            v1.0.0
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
