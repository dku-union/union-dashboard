import { AdminPublisherRecord } from "@/types/admin";

export const mockAdminPublishers: AdminPublisherRecord[] = [
  {
    id: "pub-001",
    email: "developer@dankook.ac.kr",
    name: "김개발",
    contactEmail: "developer@dankook.ac.kr",
    status: "ACTIVE",
    createdAt: "2024-01-15",
    appCount: 5,
    publishedAppCount: 3,
    inReviewAppCount: 1,
    role: "ROLE_USER",
    recentApps: [
      { id: "app-002", name: "강의 시간표 플래너", status: "in_review", version: "2.0.0" },
      { id: "app-003", name: "중고 교재 거래", status: "rejected", version: "1.1.0" },
      { id: "app-001", name: "캠퍼스 맛집 지도", status: "published", version: "1.2.0" },
    ],
  },
  {
    id: "pub-002",
    email: "studio@campus.kr",
    name: "이스튜디오",
    contactEmail: "ops@campus.kr",
    status: "PENDING",
    createdAt: "2024-03-20",
    appCount: 2,
    publishedAppCount: 0,
    inReviewAppCount: 1,
    role: "ROLE_USER",
    recentApps: [
      { id: "app-005", name: "캠퍼스 셔틀 트래커", status: "draft", version: "0.9.0" },
      { id: "app-007", name: "동아리 부스 지도", status: "in_review", version: "1.0.0" },
    ],
  },
  {
    id: "pub-003",
    email: "union-ops@dankook.ac.kr",
    name: "운영지원팀",
    contactEmail: "union-ops@dankook.ac.kr",
    status: "SUSPENDED",
    createdAt: "2024-05-08",
    appCount: 1,
    publishedAppCount: 0,
    inReviewAppCount: 0,
    role: "ROLE_USER",
    recentApps: [
      { id: "app-008", name: "중앙광장 이벤트", status: "suspended", version: "1.1.0" },
    ],
  },
];
