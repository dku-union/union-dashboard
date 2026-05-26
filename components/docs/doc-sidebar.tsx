"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Code2,
  ShieldCheck,
  Palette,
  Rocket,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

type DocLink = {
  href: string;
  title: string;
  badge?: string;
};

type DocCategoryConfig = {
  id: string;
  title: string;
  icon: LucideIcon;
  links: DocLink[];
};

const docCategories: DocCategoryConfig[] = [
  {
    id: "getting-started",
    title: "시작하기",
    icon: Sparkles,
    links: [
      { href: "/docs", title: "개요" },
      { href: "/docs/quick-start", title: "빠른 시작" },
    ],
  },
  {
    id: "development",
    title: "개발",
    icon: Code2,
    links: [
      { href: "/docs/development/config", title: "프로젝트 설정" },
      { href: "/docs/development/bridge-api", title: "Bridge API" },
      { href: "/docs/development/permissions", title: "권한 모델" },
    ],
  },
  {
    id: "guidelines",
    title: "가이드라인",
    icon: ShieldCheck,
    links: [
      { href: "/docs/guidelines/review", title: "심사 기준" },
      { href: "/docs/guidelines/notifications", title: "알림 발송" },
    ],
  },
  {
    id: "design",
    title: "디자인",
    icon: Palette,
    links: [{ href: "/docs/design", title: "디자인 가이드라인" }],
  },
  {
    id: "distribution",
    title: "배포",
    icon: Rocket,
    links: [
      { href: "/docs/distribution/build", title: "빌드와 검증" },
      { href: "/docs/distribution/submit", title: "업로드와 심사" },
    ],
  },
];

function categoryContains(category: DocCategoryConfig, pathname: string) {
  return category.links.some(
    (link) => pathname === link.href || pathname.startsWith(link.href + "/"),
  );
}

export function DocSidebar() {
  const pathname = usePathname();
  const activeCategoryId = docCategories.find((c) =>
    categoryContains(c, pathname),
  )?.id;
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(activeCategoryId ? [activeCategoryId] : []),
  );
  const [trackedActiveId, setTrackedActiveId] = useState(activeCategoryId);

  // pathname이 바뀌어 activeCategoryId가 갱신되면 해당 카테고리를 자동으로 펼침.
  // useEffect 대신 렌더 중 동기화하는 React 권장 패턴.
  if (activeCategoryId !== trackedActiveId) {
    setTrackedActiveId(activeCategoryId);
    if (activeCategoryId && !openIds.has(activeCategoryId)) {
      setOpenIds((prev) => {
        const next = new Set(prev);
        next.add(activeCategoryId);
        return next;
      });
    }
  }

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="sticky top-20 space-y-5">
      {/* Eyebrow with red dot — brand identifier */}
      <div className="flex items-center gap-2 px-3">
        <span className="h-1.5 w-1.5 rounded-full bg-union" />
        <p className="font-display text-[10px] uppercase tracking-[0.25em] font-bold text-union">
          Docs
        </p>
      </div>

      <nav className="space-y-1">
        {docCategories.map((category) => {
          const open = openIds.has(category.id);
          const isActiveCategory = activeCategoryId === category.id;
          const Icon = category.icon;

          return (
            <Collapsible
              key={category.id}
              open={open}
              onOpenChange={() => toggle(category.id)}
            >
              <CollapsibleTrigger
                className={cn(
                  "group w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-all",
                  isActiveCategory
                    ? "text-foreground"
                    : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.04]",
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-colors",
                    isActiveCategory ? "text-union" : "text-foreground/40",
                  )}
                />
                <span
                  className={cn(
                    "flex-1 text-left font-display tracking-tight",
                    isActiveCategory ? "font-bold" : "font-semibold",
                  )}
                >
                  {category.title}
                </span>
                <ChevronRight
                  className={cn(
                    "h-3 w-3 transition-all",
                    open ? "rotate-90 text-foreground/60" : "text-foreground/30",
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden">
                <ul className="mt-1 ml-[18px] pl-3 border-l border-border space-y-0.5">
                  {category.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "relative flex items-center gap-2 rounded-md px-3 py-1.5 text-[12.5px] transition-all",
                            active
                              ? "text-foreground font-semibold"
                              : "text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04]",
                          )}
                        >
                          {active && (
                            <>
                              {/* quarter-circle accent on the connector line */}
                              <span
                                aria-hidden
                                className="absolute -left-[13px] top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-r-full bg-union"
                              />
                              <span
                                aria-hidden
                                className="absolute -left-[10px] top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-union shadow-[0_0_0_3px_var(--background)]"
                              />
                            </>
                          )}
                          <span className="flex-1">{link.title}</span>
                          {link.badge && (
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      {/* Footer mark — small leaf decoration tying brand bottom of sidebar */}
      <div className="px-3 pt-4 border-t border-border/60">
        <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
          미니앱 심사 통과를 위한 Union 자체 기준입니다.
        </p>
      </div>
    </div>
  );
}
