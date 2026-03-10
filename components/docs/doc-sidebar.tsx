"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Palette, Code2, Blocks } from "lucide-react";

const docLinks = [
  { title: "문서 개요", href: "/docs", icon: BookOpen },
  { title: "디자인 가이드라인", href: "/docs/design-guidelines", icon: Palette },
  { title: "개발 가이드", href: "/docs/development-guide", icon: Code2 },
  { title: "Bridge API", href: "/docs/bridge-api", icon: Blocks },
];

export function DocSidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-20">
      <p className="heading-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3 px-3">
        문서 목록
      </p>
      <nav className="space-y-0.5">
        {docLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-all relative",
                active
                  ? "bg-union/10 text-union font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-union rounded-r-full" />
              )}
              <link.icon className="h-4 w-4" />
              {link.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
