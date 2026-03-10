"use client";

import { UseFormReturn } from "react-hook-form";
import { MiniAppFormValues } from "@/lib/validations";
import { CATEGORY_LABELS } from "@/lib/constants";
import { MiniAppCategory } from "@/types/mini-app";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeywordInput } from "./keyword-input";

interface Props {
  form: UseFormReturn<MiniAppFormValues>;
}

export function AppFormBasicInfo({ form }: Props) {
  return (
    <div className="space-y-5">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">앱 이름</FormLabel>
            <FormControl>
              <Input placeholder="미니앱 이름을 입력하세요" className="border-border/60" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shortDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">한줄 소개</FormLabel>
            <FormControl>
              <Input
                placeholder="앱을 한 문장으로 소개해주세요"
                className="border-border/60"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">상세 설명</FormLabel>
            <FormControl>
              <Textarea
                placeholder="앱의 기능과 특징을 자세히 설명해주세요"
                className="min-h-[120px] border-border/60"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">카테고리</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-border/60">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">검색 키워드</FormLabel>
            <FormControl>
              <KeywordInput
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
