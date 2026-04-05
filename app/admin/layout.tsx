"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import {
  LayoutDashboard,
  Users,
  AppWindow,
  ShieldAlert,
  UserRound,
  Settings,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const adminNavItems = [
  { title: "관리 대시보드", href: "/admin", icon: LayoutDashboard },
  { title: "퍼블리셔 관리", href: "/admin/publishers", icon: Users },
  { title: "앱 심사", href: "/admin/apps", icon: AppWindow },
  { title: "미니앱 운영", href: "/admin/mini-apps", icon: Shield },
  { title: "신고 관리", href: "/admin/reports", icon: ShieldAlert },
  { title: "사용자 관리", href: "/admin/users", icon: UserRound },
  { title: "설정", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="flex h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-up">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-union">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-union animate-pulse" />
            <span className="text-sm text-muted-foreground">로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-sidebar-border">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-3 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-white heading-display text-sm font-bold">
              U
            </div>
            <div>
              <p className="heading-display text-sm font-semibold text-sidebar-accent-foreground">Union</p>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-sidebar-foreground/70" />
                <p className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/70">Admin</p>
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator className="opacity-50" />

        <SidebarContent className="pt-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive(item.href)}
                      className="group relative transition-all duration-200"
                    >
                      {isActive(item.href) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-sidebar-primary rounded-r-full" />
                      )}
                      <item.icon className={`h-4 w-4 transition-colors ${isActive(item.href) ? "text-sidebar-primary" : "text-sidebar-foreground/70"}`} />
                      <span className={`text-[13px] ${isActive(item.href) ? "font-semibold text-sidebar-accent-foreground" : "font-normal text-sidebar-foreground"}`}>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarSeparator className="opacity-50" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/" />}
                className="group relative transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4 text-sidebar-foreground/70" />
                <span className="text-[13px] font-normal text-sidebar-foreground">퍼블리셔 대시보드</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="px-3 py-3">
            <p className="text-[10px] text-sidebar-foreground/40 tracking-wider">
              Union Admin v1.0
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex-1" />
          <ThemeToggle />
          <UserNav />
        </header>
        <main className="flex-1 p-6 blue-atmosphere">
          <div className="relative z-[1]">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
