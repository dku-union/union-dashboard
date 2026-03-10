"use client";

import { UseFormReturn } from "react-hook-form";
import { MiniAppFormValues } from "@/lib/validations";
import { PERMISSION_LABELS } from "@/lib/constants";
import { PermissionScope } from "@/types/mini-app";
import {
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Shield } from "lucide-react";

interface Props {
  form: UseFormReturn<MiniAppFormValues>;
}

export function AppFormPermissions({ form }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-lg border border-gold/20 bg-gold/5 p-3">
        <Shield className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          미니앱이 사용할 권한을 선택하세요. 불필요한 권한 요청은 심사 시 반려 사유가 될 수 있습니다.
        </p>
      </div>
      <FormField
        control={form.control}
        name="permissions"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-3">
              {(Object.entries(PERMISSION_LABELS) as [PermissionScope, { label: string; description: string }][]).map(
                ([scope, { label, description }]) => (
                  <div key={scope} className="flex items-center space-x-3 rounded-lg border border-border/40 px-3 py-2.5 hover:border-border/80 transition-colors">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(scope)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, scope]);
                          } else {
                            field.onChange(current.filter((v: string) => v !== scope));
                          }
                        }}
                      />
                    </FormControl>
                    <span className="text-sm font-medium flex-1">{label}</span>
                    <Tooltip>
                      <TooltipTrigger render={<Info className="h-4 w-4 text-muted-foreground/50 cursor-help hover:text-union transition-colors" />} />
                      <TooltipContent>
                        <p className="max-w-xs text-xs">{description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )
              )}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
