"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { landingNavItems } from "@/data/landing";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl overflow-hidden">
      {/* Geometric decorations — hidden on mobile */}
      <svg className="pointer-events-none absolute left-0 top-0 h-full w-auto opacity-[0.5] hidden sm:block" viewBox="0 0 200 200" preserveAspectRatio="xMinYMin slice" aria-hidden>
        <path d="M 0 0 L 0 200 A 200 200 0 0 1 200 0 Z" fill="#DCE4F2" />
      </svg>
      <svg className="pointer-events-none absolute right-0 bottom-0 h-full w-auto opacity-[0.5] hidden sm:block" viewBox="0 0 200 200" preserveAspectRatio="xMaxYMax slice" aria-hidden>
        <path d="M 200 200 L 200 0 A 200 200 0 0 1 0 200 Z" fill="#DCE4F2" />
      </svg>
      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Union" width={32} height={32} />
          <div>
            <p className="heading-display text-[14px] font-semibold tracking-tight text-[#262725] leading-none">
              Union
            </p>
            <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#8E908E] mt-[2px]">
              Publisher Platform
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-[13px] text-[#6B6D6B] lg:flex">
          {landingNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#262725]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="inline-flex h-8 items-center justify-center rounded-full px-5 text-[13px] font-medium text-[#6B6D6B] transition-all hover:text-[#262725] hover:bg-[#DCE4F2]/60"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-8 items-center justify-center rounded-full bg-[#E83A33] px-5 text-[13px] font-medium text-white shadow-md shadow-[#E83A33]/20 transition-all hover:bg-[#C42E29]"
          >
            지금 시작하기
          </Link>
        </div>

        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-[#6B6D6B] hover:bg-[#DCE4F2]/60 hover:text-[#262725] lg:hidden"
          aria-label="menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
