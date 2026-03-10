"use client";

import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface KeywordInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function KeywordInput({ value, onChange }: KeywordInputProps) {
  const [input, setInput] = useState("");

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim();
    if (trimmed && !value.includes(trimmed) && value.length < 10) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const removeKeyword = (keyword: string) => {
    onChange(value.filter((k) => k !== keyword));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(input);
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeKeyword(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="gap-1 bg-union/10 text-union border-union/20 text-[11px]">
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="hover:text-union/70 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="키워드 입력 후 Enter (최대 10개)"
        disabled={value.length >= 10}
        className="border-border/60"
      />
    </div>
  );
}
