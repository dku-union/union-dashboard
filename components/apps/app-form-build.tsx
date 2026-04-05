"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { MiniAppFormValues } from "@/lib/validations";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileArchive, X, CheckCircle } from "lucide-react";

interface Props {
  form: UseFormReturn<MiniAppFormValues>;
}

export function AppFormBuild({ form }: Props) {
  const [buildFile, setBuildFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBuildFile(file);
    }
  };

  return (
    <div className="space-y-5">
      <FormField
        control={form.control}
        name="version"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">버전</FormLabel>
            <FormControl>
              <Input placeholder="1.0.0" className="border-border/60 font-mono" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">빌드 파일</label>
        <p className="text-[11px] text-muted-foreground/60 mb-3 mt-1">
          .zip 형식의 빌드 파일을 업로드해주세요
        </p>
        {buildFile ? (
          <div className="flex items-center gap-3 rounded-lg border border-sage/20 bg-sage/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10">
              <FileArchive className="h-5 w-5 text-sage" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium truncate">{buildFile.name}</p>
                <CheckCircle className="h-3.5 w-3.5 text-sage shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                {(buildFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-union"
              onClick={() => setBuildFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 p-8 hover:border-union/30 hover:bg-union/5 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 mb-3">
              <Upload className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <span className="text-sm text-muted-foreground">
              클릭하여 빌드 파일 업로드
            </span>
            <span className="text-[11px] text-muted-foreground/60 mt-1 font-mono">
              .zip (최대 50MB)
            </span>
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      <FormField
        control={form.control}
        name="releaseNote"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">릴리즈 노트</FormLabel>
            <FormControl>
              <Textarea
                placeholder="이번 버전에서 변경된 내용을 작성해주세요"
                className="min-h-[100px] border-border/60"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
