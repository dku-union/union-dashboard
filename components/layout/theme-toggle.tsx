"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative overflow-hidden">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">테마 변경</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem onClick={() => setTheme("light")} className="text-[13px]">
          <Sun className="mr-2 h-3.5 w-3.5" />
          라이트
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="text-[13px]">
          <Moon className="mr-2 h-3.5 w-3.5" />
          다크
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="text-[13px]">
          시스템
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
