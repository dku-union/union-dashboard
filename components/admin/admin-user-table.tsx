"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminRoleRecord, AdminUserRecord } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const userFilters: { label: string; value: AdminUserRecord["status"] | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "활성", value: "ACTIVE" },
  { label: "대기", value: "PENDING" },
  { label: "정지", value: "SUSPENDED" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR");
}

export function AdminUserTable() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [admins, setAdmins] = useState<AdminRoleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AdminUserRecord["status"] | "all">("all");
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "플랫폼 계정 목록을 불러오지 못했습니다.");
      }

      setUsers(data.users);
      setAdmins(data.admins);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "플랫폼 계정 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesFilter = filter === "all" || user.status === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.role.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, query, users]);

  const updateStatus = async (userId: string, nextStatus: AdminUserRecord["status"]) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "사용자 상태를 변경하지 못했습니다.");
      }

      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, status: data.status } : user)),
      );
      toast.success("사용자 상태를 변경했습니다.");
    } catch (actionError) {
      toast.error(
        actionError instanceof Error ? actionError.message : "사용자 상태를 변경하지 못했습니다.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader className="gap-4 border-b border-border/60 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="heading-display text-lg">플랫폼 계정 목록</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              `publishers` 테이블 기준 계정과 운영 상태를 관리합니다.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[320px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="이름, 이메일, 역할 검색"
                className="h-10 border-border/60 bg-muted/20 pl-9"
              />
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as AdminUserRecord["status"] | "all")}>
              <TabsList>
                {userFilters.map((status) => (
                  <TabsTrigger key={status.value} value={status.value} className="text-xs">
                    {status.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" onClick={() => void fetchUsers()}>
                다시 시도
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">조건에 맞는 계정이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead>계정</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>인증</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead className="text-right">조치</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border/50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border/60 bg-background">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.verified
                            ? "border-sage/30 bg-sage/10 text-sage"
                            : "border-gold/30 bg-gold/10 text-gold"
                        }
                      >
                        {user.verified ? "인증 완료" : "미인증"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "ACTIVE"
                            ? "border-sage/30 bg-sage/10 text-sage"
                            : user.status === "PENDING"
                              ? "border-gold/30 bg-gold/10 text-gold"
                              : "border-destructive/30 bg-destructive/10 text-destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          void updateStatus(
                            user.id,
                            user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                          )
                        }
                      >
                        {user.status === "ACTIVE" ? "정지" : "활성화"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-lg">관리자 권한 계정</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            `ROLE_ADMIN` 권한이 부여된 계정 목록입니다.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : admins.length ? (
            admins.map((role) => (
              <div key={role.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{role.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{role.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="border-union/30 bg-union/10 text-union">
                    {role.adminRole}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(role.assignedAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">관리자 권한 계정이 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
