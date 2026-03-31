"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { landingNavItems } from "@/data/landing";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#060a14]/80 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <div className="overflow-hidden rounded-xl">
            <Image
              src="/logo.png"
              alt="Union logo"
              width={36}
              height={36}
              className="h-9 w-9 object-cover"
              priority
            />
          </div>
          <span className="text-[17px] font-bold tracking-[-0.01em]">
            Union
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {landingNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-slate-400 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:text-white"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-white px-5 py-2 text-[13px] font-semibold text-slate-950 transition-all hover:bg-slate-100"
          >
            시작하기
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg text-white hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
