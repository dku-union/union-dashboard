import Link from "next/link";
import Image from "next/image";
import { ScrollToTop } from "./scroll-to-top";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-[#EDF2FA] text-[#262725]">
      <ScrollToTop />
      <header className="border-b border-[#DCE4F2] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Union" width={28} height={28} />
            <p className="heading-display text-[14px] font-semibold tracking-tight">
              Union
            </p>
          </Link>
          <Link
            href="/"
            className="text-[12px] text-[#6B6D6B] transition-colors hover:text-[#262725]"
          >
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {children}
      </main>

      <footer className="border-t border-[#DCE4F2] bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-6 text-[11px] text-[#8E908E] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Union. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal/terms" className="transition-colors hover:text-[#262725]">
              이용약관
            </Link>
            <Link href="/legal/privacy" className="transition-colors hover:text-[#262725]">
              개인정보처리방침
            </Link>
            <span>단국대학교 캡스톤디자인 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
