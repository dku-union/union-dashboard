"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl border border-border/60 bg-[#0B1628] dark:bg-[#060D1B] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-union/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-gold/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-sage/60" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/30 ml-2">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 gap-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-sage" />
              복사됨
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              복사
            </>
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-[13px] leading-relaxed text-white/80 font-mono">{code}</code>
      </pre>
    </div>
  );
}
