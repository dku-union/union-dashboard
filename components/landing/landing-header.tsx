"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { landingNavItems } from "@/data/landing";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#070d0a]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-[#408A71]">
            <span className="text-[11px] font-bold text-white leading-none">U</span>
          </div>
          <div>
            <p className="heading-display text-[14px] font-semibold tracking-tight leading-none">Union</p>
            <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/25 mt-[2px]">Publisher Platform</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-[13px] text-white/40 lg:flex">
          {landingNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white/80"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="inline-flex h-8 items-center justify-center rounded-full px-5 text-[13px] font-medium text-white/45 transition-all hover:text-white hover:bg-white/[0.06]"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-8 items-center justify-center rounded-full bg-[#408A71] px-5 text-[13px] font-medium text-white shadow-lg shadow-[#285A48]/25 transition-all hover:bg-[#52A882]"
          >
            지금 시작하기
          </Link>
        </div>

        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-white/50 hover:bg-white/[0.06] hover:text-white lg:hidden"
          aria-label="menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
