"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  variant?: "default" | "compact";
}

// Brand-aligned: charcoal #262725 surface (DESIGN.md core dark) with
// a red accent corner instead of macOS dots. Monospace face uses Pretendard's
// JetBrains Mono fallback chain from globals.css.
export function CodeBlock({
  code,
  language = "typescript",
  variant = "default",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg group",
        // charcoal surface with subtle hairline
        "bg-[#262725] ring-1 ring-inset ring-white/5",
      )}
    >
      {/* red accent triangle at top-right — brand identifier */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-3 h-3 bg-union opacity-90"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-mono">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 text-[10px] uppercase tracking-wider transition-colors",
            "text-white/40 hover:text-white",
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-union" />
              <span className="text-union">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>복사</span>
            </>
          )}
        </button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto",
          variant === "compact" ? "p-3" : "p-4",
        )}
      >
        <code className="text-[13px] leading-[1.65] text-[#EDF2FA]/90 font-mono">
          {code}
        </code>
      </pre>
    </div>
  );
}
