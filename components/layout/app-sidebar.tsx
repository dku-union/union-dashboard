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
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "대시보드", href: "/", icon: LayoutDashboard },
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
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderMenu = (items: typeof navItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            render={<Link href={item.href} />}
            isActive={isActive(item.href)}
            className="group relative transition-all duration-200"
          >
            {isActive(item.href) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-union rounded-r-full" />
            )}
            <item.icon className={`h-4 w-4 transition-colors ${isActive(item.href) ? "text-union" : "text-sidebar-foreground/70"}`} />
            <span className={`text-[13px] ${isActive(item.href) ? "font-semibold text-foreground" : "font-normal text-sidebar-foreground"}`}>
              {item.title}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-union text-white heading-display text-sm font-bold">
            U
          </div>
          <div>
            <p className="heading-display text-sm font-semibold text-foreground">Union</p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Publisher</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="opacity-50" />

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            {renderMenu(navItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3">
            팀
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenu(teamItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3">
            리소스
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenu(resourceItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="opacity-50" />
        {renderMenu(bottomItems)}
        <div className="px-3 py-3">
          <p className="text-[10px] text-muted-foreground/40 tracking-wider">
            Union Platform v1.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
