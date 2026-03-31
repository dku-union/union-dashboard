"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { landingNavItems } from "@/data/landing";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 text-sm font-semibold">
            U
          </div>
          <div>
            <p className="heading-display text-lg font-semibold">UniApp</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-200 lg:flex">
          {landingNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="ghost"
            className="rounded-full px-5 text-white hover:bg-white/10 hover:text-white"
            render={<Link href="/login" />}
          >
            로그인
          </Button>
          <Button
            className="rounded-full bg-[linear-gradient(135deg,#5B8CFF,#4776F3)] px-5 text-white shadow-lg shadow-blue-900/30 hover:opacity-95"
            render={<Link href="/signup" />}
          >
            지금 시작하기
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-white hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
