"use client";

import { useState } from "react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { WorkspaceCard } from "@/components/workspace/workspace-card";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Layers, Loader2 } from "lucide-react";

export default function WorkspaceListPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { workspaces, isLoading, refetch } = useWorkspaces();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between animate-fade-up">
        <div>
          <h1 className="text-heading-1">워크스페이스</h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            소속된 워크스페이스를 관리하고 새로 만드세요.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-union text-white hover:bg-union/90">
          <Plus className="mr-2 h-4 w-4" />
          새 워크스페이스
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws, i) => (
            <div key={ws.id} className={`animate-fade-up delay-${i + 1}`}>
              <WorkspaceCard workspace={ws} currentUserRole={ws.myRole as "owner" | "admin" | "developer" | "viewer"} />
            </div>
          ))}

          {/* Create card */}
          <div className={`animate-fade-up delay-${workspaces.length + 1}`}>
            <button
              onClick={() => setCreateOpen(true)}
              className="block w-full h-full"
            >
              <Card className="border-border/60 border-dashed hover:border-union/50 hover:bg-union/[0.03] transition-all cursor-pointer h-full min-h-[160px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">새 워크스페이스 만들기</span>
                </div>
              </Card>
            </button>
          </div>
        </div>
      )}

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={refetch} />
    </div>
  );
}
