"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminRoleRecord, AdminUserRecord } from "@/types/admin";
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
  { label: "정지", value: "SUSPENDED" },
];

export function AdminUserTable({
  initialUsers,
  adminRoles,
}: {
  initialUsers: AdminUserRecord[];
  adminRoles: AdminRoleRecord[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState<AdminUserRecord["status"] | "all">("all");
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesFilter = filter === "all" || user.status === filter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        (user.university ?? "").toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, users]);

  const toggleStatus = (userId: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : user,
      ),
    );
    toast.success("사용자 상태가 변경되었습니다.");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader className="gap-4 border-b border-border/60 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="heading-display text-lg">전체 사용자 목록</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              사용자 계정을 조회하고 정지 또는 해제를 처리합니다.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[320px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="이름, 이메일, 학교 검색"
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
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead>사용자</TableHead>
                <TableHead>구분</TableHead>
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
                      <p className="text-xs text-muted-foreground">{user.university ?? "-"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border/60 bg-background">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.verified ? "border-sage/30 bg-sage/10 text-sage" : "border-gold/30 bg-gold/10 text-gold"}>
                      {user.verified ? "인증됨" : "미인증"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.status === "ACTIVE" ? "border-sage/30 bg-sage/10 text-sage" : "border-destructive/30 bg-destructive/10 text-destructive"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleStatus(user.id)}>
                      {user.status === "ACTIVE" ? "정지" : "해제"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="heading-display text-lg">관리자 권한 등급</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            슈퍼관리자와 심사관리자 등급을 확인합니다.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {adminRoles.map((role) => (
            <div key={role.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{role.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{role.email}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={role.adminRole === "SUPER_ADMIN" ? "border-union/30 bg-union/10 text-union" : "border-gold/30 bg-gold/10 text-gold"}>
                  {role.adminRole === "SUPER_ADMIN" ? "슈퍼관리자" : "심사관리자"}
                </Badge>
                <p className="mt-1 text-xs text-muted-foreground">{role.assignedAt}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
